using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EVCharge.Backend.Models
{
  public class User
  {
    [BsonId] public ObjectId Id { get; set; }
    public string Username { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string Role { get; set; } = "StationOperator"; // or Backoffice
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
