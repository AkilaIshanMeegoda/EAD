using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/bookings")]
  public class BookingsController : ControllerBase
  {
    private readonly IBookingService _svc;
    public BookingsController(IBookingService s) { _svc = s; }

    // Mobile EV owner creates/updates/cancels
    [HttpPost] public async Task<IActionResult> Create(CreateBookingRequest r) => Ok(await _svc.CreateAsync(r));
    [HttpPatch("{id}")] public async Task<IActionResult> Update(string id, UpdateBookingRequest r) => Ok(await _svc.UpdateAsync(id, r));
    [HttpPost("{id}/cancel")] public async Task<IActionResult> Cancel(string id, CancelBookingRequest r) => Ok(await _svc.CancelAsync(id, r.Reason));

    // Approval (Backoffice or StationOperator can do it)
    [Authorize] // any authenticated role
    [HttpPost("{id}/approve")] public async Task<IActionResult> Approve(string id, ApproveBookingRequest r) => Ok(await _svc.ApproveAsync(id, r.Approve));

    // Dashboard counts (mobile home screen)
    [HttpGet("dashboard/pending-count")] public async Task<IActionResult> Pending() => Ok(new { count = await _svc.PendingCountAsync() });
    [HttpGet("dashboard/future-approved-count")] public async Task<IActionResult> FutureApproved() => Ok(new { count = await _svc.FutureApprovedCountAsync() });

    // History for EV owner
    [HttpGet("owner/{nic}/history")] public async Task<IActionResult> History(string nic) => Ok(await _svc.OwnerHistoryAsync(nic));
  }
}
