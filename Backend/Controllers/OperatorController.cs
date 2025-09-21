using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/operator"), Authorize(Policy = "StationOperatorOnly")]
  public class OperatorController : ControllerBase
  {
    private readonly IBookingService _svc;
    public OperatorController(IBookingService s) { _svc = s; }

    [HttpPost("scan-qr")] public async Task<IActionResult> Scan(ScanQrRequest r) => Ok(await _svc.ConfirmScanAsync(r.QrPayload));
    [HttpPost("finalize/{bookingId}")] public async Task<IActionResult> Finalize(string bookingId) => Ok(await _svc.FinalizeAsync(bookingId));
  }
}
