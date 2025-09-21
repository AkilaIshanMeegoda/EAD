namespace EVCharge.Backend.Dtos
{
  public record CreateBookingRequest(string EVNic, string StationId, DateTime StartUtc, DateTime EndUtc);
  public record UpdateBookingRequest(DateTime NewStartUtc, DateTime NewEndUtc);
  public record CancelBookingRequest(string Reason);
  public record ApproveBookingRequest(bool Approve); // if approve => create QR
  public record ScanQrRequest(string QrPayload);
}
