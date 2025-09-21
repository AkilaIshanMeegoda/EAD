namespace EVCharge.Backend.Dtos
{
  public record CreateEVOwnerRequest(string NIC, string FullName, string Phone, string Email);
  public record UpdateEVOwnerRequest(string? FullName, string? Phone, string? Email);
}
