using EVCharge.Backend.Models;

namespace EVCharge.Backend.Dtos
{
  public record CreateStationRequest(string Name, string Location, StationType Type);
  public record UpdateStationRequest(string? Name, string? Location, StationType? Type);
  public record UpsertScheduleRequest(DateTime Date, int TotalSlots, List<string> StartTimes); // "HH:mm"
}
