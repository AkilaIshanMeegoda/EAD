/*  SE4040 – EV Charging Backend
    File: IBookingService.cs
*/
using System.Collections.Generic;
using System.Threading.Tasks;
using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;

namespace EVCharge.Backend.Services
{
  /// <summary>Bookings: 7-day window, ≥12h update/cancel, approve→QR, finalize.</summary>
  public interface IBookingService
  {
    Task<Booking> CreateAsync(CreateBookingRequest r);
    Task<Booking> UpdateAsync(string id, UpdateBookingRequest r);
    Task<Booking> CancelAsync(string id, string reason);
    Task<Booking> ApproveAsync(string id, bool approve);
    Task<Booking> ConfirmScanAsync(string qrPayload);
    Task<Booking> FinalizeAsync(string id);

    Task<long> PendingCountAsync();
    Task<long> FutureApprovedCountAsync();
    Task<List<Booking>> OwnerHistoryAsync(string nic);
  }
}
