using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;
using EVCharge.Backend.Repositories;
using MongoDB.Bson;

namespace EVCharge.Backend.Services
{

  public class StationService : IStationService
  {
    private readonly StationRepository _repo;
    private readonly BookingRepository _book;
    public StationService(StationRepository repo, BookingRepository book) { _repo = repo; _book = book; }

    public Task<List<Station>> ListAsync() => _repo.ListAsync();

    public async Task<Station> CreateAsync(CreateStationRequest r)
    {
      var s = new Station { Name = r.Name, Location = r.Location, Type = r.Type, Status = StationStatus.Active };
      await _repo.InsertAsync(s); return s;
    }

    public async Task<Station> UpdateAsync(string id, UpdateStationRequest r)
    {
      var oid = ObjectId.Parse(id);
      var s = await _repo.GetAsync(oid) ?? throw new Exception("Station not found");
      if (r.Name is not null) s.Name = r.Name;
      if (r.Location is not null) s.Location = r.Location;
      if (r.Type is not null) s.Type = r.Type.Value;
      await _repo.UpdateAsync(s); return s;
    }

    public async Task<Station> UpsertScheduleAsync(string id, UpsertScheduleRequest r)
    {
      var oid = ObjectId.Parse(id);
      var s = await _repo.GetAsync(oid) ?? throw new Exception("Station not found");
      var times = r.StartTimes.Select(t => TimeOnly.Parse(t)).ToList();
      var day = s.Schedules.FirstOrDefault(x => x.Date.Date == r.Date.Date);
      if (day is null)
      {
        s.Schedules.Add(new SlotSchedule { Date = r.Date.Date, TotalSlots = r.TotalSlots, StartTimes = times });
      }
      else
      {
        day.TotalSlots = r.TotalSlots; day.StartTimes = times;
      }
      await _repo.UpdateAsync(s); return s;
    }

    public async Task<Station> DeactivateAsync(string id)
    {
      var oid = ObjectId.Parse(id);
      var s = await _repo.GetAsync(oid) ?? throw new Exception("Station not found");
      var active = await _book.ActiveForStationAsync(oid);
      if (active > 0) throw new Exception("Cannot deactivate: active bookings exist");
      s.Status = StationStatus.Inactive;
      await _repo.UpdateAsync(s); return s;
    }

    public async Task<Station> GetAsync(string id)
    {
      var s = await _repo.GetAsync(ObjectId.Parse(id)) ?? throw new Exception("Station not found");
      return s;
    }
  }
}
