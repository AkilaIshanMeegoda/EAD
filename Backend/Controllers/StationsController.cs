using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/stations")]
  public class StationsController : ControllerBase
  {
    private readonly IStationService _svc;
    public StationsController(IStationService s) { _svc = s; }

    [HttpGet] public async Task<IActionResult> List() => Ok(await _svc.ListAsync());

    [Authorize(Policy = "BackofficeOnly")]
    [HttpPost] public async Task<IActionResult> Create(CreateStationRequest r) => Ok(await _svc.CreateAsync(r));

    [Authorize(Policy = "BackofficeOnly")]
    [HttpPatch("{id}")] public async Task<IActionResult> Update(string id, UpdateStationRequest r) => Ok(await _svc.UpdateAsync(id, r));

    [Authorize(Policy = "StationOperatorOnly")]
    [HttpPost("{id}/schedule")] public async Task<IActionResult> UpsertSchedule(string id, UpsertScheduleRequest r) => Ok(await _svc.UpsertScheduleAsync(id, r));

    [Authorize(Policy = "BackofficeOnly")]
    [HttpPost("{id}/deactivate")] public async Task<IActionResult> Deactivate(string id) => Ok(await _svc.DeactivateAsync(id));

    [HttpGet("{id}")] public async Task<IActionResult> Get(string id) => Ok(await _svc.GetAsync(id));
  }
}
