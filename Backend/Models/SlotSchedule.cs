namespace EVCharge.Backend.Models
{
  public class SlotSchedule
  {
    public DateTime Date { get; set; }                  // day
    public int TotalSlots { get; set; }                 // total available slots that day
    public List<TimeOnly> StartTimes { get; set; } = new(); // available start times (e.g., 08:00, 08:30...)
  }
}
