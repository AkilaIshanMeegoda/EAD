using EVCharge.Backend.Auth;
using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;
using EVCharge.Backend.Repositories;

namespace EVCharge.Backend.Services
{

  public class UserService : IUserService
  {
    private readonly UserRepository _repo;
    private readonly PasswordHasher _hasher;
    private readonly JwtTokenService _jwt;

    public UserService(UserRepository r, PasswordHasher h, JwtTokenService j) { _repo = r; _hasher = h; _jwt = j; }

    public async Task<LoginResponse> LoginAsync(LoginRequest req)
    {
      var u = await _repo.FindByUsernameAsync(req.Username) ?? throw new Exception("User not found");
      if (!u.IsActive || !_hasher.Verify(req.Password, u.PasswordHash)) throw new Exception("Invalid credentials");
      var token = _jwt.Create(u.Username, u.Role);
      return new LoginResponse(token, u.Role, u.Username);
    }

    public async Task<User> CreateAsync(CreateUserRequest req)
    {
      if (req.Role != "Backoffice" && req.Role != "StationOperator") throw new Exception("Invalid role");
      var exists = await _repo.FindByUsernameAsync(req.Username);
      if (exists != null) throw new Exception("Username already exists");
      var u = new User { Username = req.Username, PasswordHash = _hasher.Hash(req.Password), Role = req.Role, IsActive = true };
      await _repo.InsertAsync(u);
      return u;
    }

    public async Task<User> UpdateAsync(string username, UpdateUserRequest req)
    {
      var u = await _repo.FindByUsernameAsync(username) ?? throw new Exception("User not found");
      if (req.Password is not null) u.PasswordHash = _hasher.Hash(req.Password);
      if (req.Role is not null)
      {
        if (req.Role != "Backoffice" && req.Role != "StationOperator") throw new Exception("Invalid role");
        u.Role = req.Role;
      }
      if (req.IsActive is not null) u.IsActive = req.IsActive.Value;
      await _repo.UpdateAsync(u);
      return u;
    }
  }
}
