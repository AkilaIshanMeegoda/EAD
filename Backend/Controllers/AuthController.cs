using EVCharge.Backend.Dtos;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace EVCharge.Backend.Controllers
{
  [ApiController, Route("api/auth")]
  public class AuthController : ControllerBase
  {
    private readonly IUserService _svc;
    public AuthController(IUserService s) { _svc = s; }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req) =>
      Ok(await _svc.LoginAsync(req));
  }
}
