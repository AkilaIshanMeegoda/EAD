using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EVCharge.Backend.Models
{
  public class Booking
  {
    [BsonId] public ObjectId Id { get; set; }
    public string EVNic { get; set; } = default!;
    public ObjectId StationId { get; set; }
    public DateTime ReservationStart { get; set; } // UTC
    public DateTime ReservationEnd { get; set; }   // UTC
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string? QrPayload { get; set; } // set after approval
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
  }
}
