using MongoDB.Bson.Serialization.Attributes;

namespace EVCharge.Backend.Models
{
  public class EVOwner
  {
    [BsonId] public string NIC { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Email { get; set; } = default!;
    public bool IsActive { get; set; } = true; // backoffice can reactivate
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
