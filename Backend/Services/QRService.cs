namespace EVCharge.Backend.Services
{
  public class QRService : IQRService
  {
    public string Generate(string bookingId) => $"BOOKING:{bookingId}";
    public bool TryParse(string payload, out string bookingId)
    {
      bookingId = string.Empty;
      if (!payload.StartsWith("BOOKING:")) return false;
      bookingId = payload.Substring("BOOKING:".Length);
      return true;
    }
  }
}
