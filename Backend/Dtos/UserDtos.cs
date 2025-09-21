namespace EVCharge.Backend.Dtos
{
  public record CreateUserRequest(string Username, string Password, string Role); // Backoffice only
  public record UpdateUserRequest(string? Password, string? Role, bool? IsActive);
}
