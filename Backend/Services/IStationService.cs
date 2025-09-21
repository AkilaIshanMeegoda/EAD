/*  SE4040 – EV Charging Backend
    File: IStationService.cs
*/
using System.Collections.Generic;
using System.Threading.Tasks;
using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;

namespace EVCharge.Backend.Services
{
  /// <summary>Stations + schedules; prevent deactivation when active bookings exist.</summary>
  public interface IStationService
  {
    Task<List<Station>> ListAsync();
    Task<Station> CreateAsync(CreateStationRequest r);
    Task<Station> UpdateAsync(string id, UpdateStationRequest r);
    Task<Station> UpsertScheduleAsync(string id, UpsertScheduleRequest r);
    Task<Station> DeactivateAsync(string id);
    Task<Station> GetAsync(string id);
  }
}
