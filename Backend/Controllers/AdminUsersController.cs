using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/admin/users"), Authorize(Policy = "BackofficeOnly")]
  public class AdminUsersController : ControllerBase
  {
    private readonly IUserService _svc;
    public AdminUsersController(IUserService s) { _svc = s; }

    [HttpPost] public async Task<IActionResult> Create(CreateUserRequest r) => Ok(await _svc.CreateAsync(r));
    [HttpPatch("{username}")] public async Task<IActionResult> Update(string username, UpdateUserRequest r) => Ok(await _svc.UpdateAsync(username, r));
  }
}
