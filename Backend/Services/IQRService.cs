/*  SE4040 – EV Charging Backend
    File: IQRService.cs
*/
namespace EVCharge.Backend.Services
{
  /// <summary>Encapsulate QR payload format/parsing for approvals.</summary>
  public interface IQRService
  {
    /// <summary>Create a QR payload for a given booking id.</summary>
    string Generate(string bookingId);

    /// <summary>Try to parse payload to a booking id (returns false if invalid).</summary>
    bool TryParse(string payload, out string bookingId);
  }
}
