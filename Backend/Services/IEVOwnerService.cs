/*  SE4040 – EV Charging Backend
    File: IEVOwnerService.cs
*/
using System.Threading.Tasks;
using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;

namespace EVCharge.Backend.Services
{
  /// <summary>EV Owner CRUD using NIC as PK (spec requirement).</summary>
  public interface IEVOwnerService
  {
    Task<EVOwner> CreateAsync(CreateEVOwnerRequest r);
    Task<EVOwner> UpdateAsync(string nic, UpdateEVOwnerRequest r);
    Task DeactivateAsync(string nic);
    Task ActivateAsync(string nic);
    Task DeleteAsync(string nic);
    Task<EVOwner?> GetAsync(string nic);
  }
}
