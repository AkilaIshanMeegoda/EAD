using EVCharge.Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public class BookingRepository
  {
    private readonly IMongoCollection<Booking> _col;
    public BookingRepository(IMongoContext ctx) => _col = ctx.Get<Booking>("bookings");

    public Task InsertAsync(Booking b) => _col.InsertOneAsync(b);
    public Task UpdateAsync(Booking b) => _col.ReplaceOneAsync(x => x.Id == b.Id, b);
    public Task<Booking?> GetAsync(ObjectId id) => _col.Find(x => x.Id == id).FirstOrDefaultAsync();
    public Task<List<Booking>> ForStationAndDateAsync(ObjectId stationId, DateTime dayUtc) =>
      _col.Find(x => x.StationId == stationId && x.ReservationStart.Date == dayUtc.Date && x.Status != BookingStatus.Cancelled)
          .ToListAsync();

    public Task<long> ActiveForStationAsync(ObjectId stationId) =>
      _col.CountDocumentsAsync(x => x.StationId == stationId && (x.Status == BookingStatus.Pending || x.Status == BookingStatus.Approved));

    public Task<long> PendingCountAsync() => _col.CountDocumentsAsync(x => x.Status == BookingStatus.Pending);
    public Task<long> FutureApprovedCountAsync() =>
      _col.CountDocumentsAsync(x => x.Status == BookingStatus.Approved && x.ReservationStart > DateTime.UtcNow);
    public Task<List<Booking>> ForOwnerHistoryAsync(string nic) =>
      _col.Find(x => x.EVNic == nic).SortByDescending(x => x.ReservationStart).ToListAsync();
  }
}
