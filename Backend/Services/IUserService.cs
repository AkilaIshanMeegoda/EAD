using System.Threading.Tasks;
using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;

namespace EVCharge.Backend.Services
{
  /// <summary>Auth + admin user management for Backoffice & Operator.</summary>
  public interface IUserService
  {
    /// <summary>Validate credentials and return JWT.</summary>
    Task<LoginResponse> LoginAsync(LoginRequest req);

    /// <summary>Create a Backoffice or StationOperator user.</summary>
    Task<User> CreateAsync(CreateUserRequest req);

    /// <summary>Change password/role/active state.</summary>
    Task<User> UpdateAsync(string username, UpdateUserRequest req);
  }
}
