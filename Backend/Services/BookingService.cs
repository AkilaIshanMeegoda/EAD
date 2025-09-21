using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;
using EVCharge.Backend.Repositories;
using MongoDB.Bson;

namespace EVCharge.Backend.Services
{
  public class BookingService : IBookingService
  {
    private readonly BookingRepository _repo;
    private readonly StationRepository _stations;
    private readonly EVOwnerRepository _owners;
    private readonly IQRService _qr;

    public BookingService(BookingRepository r, StationRepository s, EVOwnerRepository o, IQRService q)
    { _repo = r; _stations = s; _owners = o; _qr = q; }

    // Rules: reservation must be within 7 days from booking date; station active; owner active; slot capacity not exceeded
    public async Task<Booking> CreateAsync(CreateBookingRequest r)
    {
      var owner = await _owners.GetAsync(r.EVNic) ?? throw new Exception("EV Owner not found");
      if (!owner.IsActive) throw new Exception("EV Owner is deactivated");
      var station = await _stations.GetAsync(ObjectId.Parse(r.StationId)) ?? throw new Exception("Station not found");
      if (station.Status != StationStatus.Active) throw new Exception("Station inactive");

      var now = DateTime.UtcNow;
      if (r.StartUtc < now || r.EndUtc <= r.StartUtc) throw new Exception("Invalid time range");
      if (r.StartUtc > now.AddDays(7)) throw new Exception("Reservation must be within 7 days of booking");

      // Check schedule capacity
      var day = station.Schedules.FirstOrDefault(x => x.Date.Date == r.StartUtc.Date)
        ?? throw new Exception("No schedule for that date");
      // Start time must be in allowed start times
      if (!day.StartTimes.Contains(TimeOnly.FromDateTime(r.StartUtc))) throw new Exception("Start time not available");

      // Count overlapping approved/pending bookings
      var bookings = await _repo.ForStationAndDateAsync(station.Id, r.StartUtc.Date);
      var concurrent = bookings.Count(b =>
        b.Status != BookingStatus.Cancelled &&
        b.ReservationStart == r.StartUtc);
      if (concurrent >= day.TotalSlots) throw new Exception("No slot available at that time");

      var b = new Booking
      {
        EVNic = r.EVNic,
        StationId = station.Id,
        ReservationStart = r.StartUtc,
        ReservationEnd = r.EndUtc,
        Status = BookingStatus.Pending
      };
      await _repo.InsertAsync(b);
      return b;
    }

    // Updates allowed ≥12 hours before reservation start
    public async Task<Booking> UpdateAsync(string id, UpdateBookingRequest r)
    {
      var b = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Booking not found");
      if ((b.ReservationStart - DateTime.UtcNow) < TimeSpan.FromHours(12))
        throw new Exception("Updates allowed at least 12 hours before start");
      if (b.Status == BookingStatus.Cancelled || b.Status == BookingStatus.Completed)
        throw new Exception("Cannot update cancelled/completed booking");

      b.ReservationStart = r.NewStartUtc; b.ReservationEnd = r.NewEndUtc;
      b.Status = BookingStatus.Pending; b.ApprovedAt = null; b.QrPayload = null;
      await _repo.UpdateAsync(b);
      return b;
    }

    // Cancel ≥12 hours before start
    public async Task<Booking> CancelAsync(string id, string reason)
    {
      var b = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Booking not found");
      if ((b.ReservationStart - DateTime.UtcNow) < TimeSpan.FromHours(12))
        throw new Exception("Cancellations allowed at least 12 hours before start");
      b.Status = BookingStatus.Cancelled; b.CancelledAt = DateTime.UtcNow;
      await _repo.UpdateAsync(b); return b;
    }

    // Backoffice/Operator approves => QR generated
    public async Task<Booking> ApproveAsync(string id, bool approve)
    {
      var b = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Booking not found");
      if (b.Status == BookingStatus.Cancelled) throw new Exception("Cancelled booking");
      if (!approve)
      {
        b.Status = BookingStatus.Pending; b.QrPayload = null; b.ApprovedAt = null;
      }
      else
      {
        b.Status = BookingStatus.Approved; b.ApprovedAt = DateTime.UtcNow;
        b.QrPayload = _qr.Generate(b.Id.ToString());
      }
      await _repo.UpdateAsync(b); return b;
    }

    public async Task<Booking> ConfirmScanAsync(string qrPayload)
    {
      if (!_qr.TryParse(qrPayload, out var id)) throw new Exception("Invalid QR");
      var b = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Booking not found");
      if (b.Status != BookingStatus.Approved) throw new Exception("Booking not approved");
      // At scan time we just verify; business confirmation can be implicit
      return b;
    }

    public async Task<Booking> FinalizeAsync(string id)
    {
      var b = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Booking not found");
      if (b.Status != BookingStatus.Approved) throw new Exception("Only approved bookings can be completed");
      b.Status = BookingStatus.Completed; b.CompletedAt = DateTime.UtcNow;
      await _repo.UpdateAsync(b); return b;
    }

    public Task<long> PendingCountAsync() => _repo.PendingCountAsync();
    public Task<long> FutureApprovedCountAsync() => _repo.FutureApprovedCountAsync();
    public Task<List<Booking>> OwnerHistoryAsync(string nic) => _repo.ForOwnerHistoryAsync(nic);
  }
}
