using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/evowners")]
  public class EVOwnersController : ControllerBase
  {
    private readonly IEVOwnerService _svc;
    public EVOwnersController(IEVOwnerService s) { _svc = s; }

    // Mobile: self-register (no auth)
    [HttpPost] public async Task<IActionResult> Create(CreateEVOwnerRequest r) => Ok(await _svc.CreateAsync(r));

    // Mobile: self-update (no token here; in production you'd auth by OTP/JWT)
    [HttpPatch("{nic}")] public async Task<IActionResult> Update(string nic, UpdateEVOwnerRequest r) => Ok(await _svc.UpdateAsync(nic, r));

    // Deactivate self
    [HttpPost("{nic}/deactivate")] public async Task<IActionResult> Deactivate(string nic) { await _svc.DeactivateAsync(nic); return Ok(); }

    // Backoffice only can reactivate
    [Authorize(Policy = "BackofficeOnly")]
    [HttpPost("{nic}/activate")] public async Task<IActionResult> Activate(string nic) { await _svc.ActivateAsync(nic); return Ok(); }

    [HttpGet("{nic}")] public async Task<IActionResult> Get(string nic) => Ok(await _svc.GetAsync(nic));
  }
}
