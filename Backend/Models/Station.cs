using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EVCharge.Backend.Models
{
  public class Station
  {
    [BsonId] public ObjectId Id { get; set; }
    public string Name { get; set; } = default!;
    public string Location { get; set; } = default!; // "lat,lng" or human address (map is frontend)
    public StationType Type { get; set; }
    public StationStatus Status { get; set; } = StationStatus.Active;
    public List<SlotSchedule> Schedules { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
