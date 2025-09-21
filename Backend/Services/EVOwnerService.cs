using EVCharge.Backend.Dtos;
using EVCharge.Backend.Models;
using EVCharge.Backend.Repositories;

namespace EVCharge.Backend.Services
{

  public class EVOwnerService : IEVOwnerService
  {
    private readonly EVOwnerRepository _repo;
    public EVOwnerService(EVOwnerRepository r) { _repo = r; }

    public async Task<EVOwner> CreateAsync(CreateEVOwnerRequest r)
    {
      if (await _repo.ExistsAsync(r.NIC)) throw new Exception("NIC already exists");
      var o = new EVOwner { NIC = r.NIC, FullName = r.FullName, Phone = r.Phone, Email = r.Email, IsActive = true };
      await _repo.UpsertAsync(o);
      return o;
    }

    public async Task<EVOwner> UpdateAsync(string nic, UpdateEVOwnerRequest r)
    {
      var o = await _repo.GetAsync(nic) ?? throw new Exception("EV Owner not found");
      if (r.FullName is not null) o.FullName = r.FullName;
      if (r.Phone is not null) o.Phone = r.Phone;
      if (r.Email is not null) o.Email = r.Email;
      await _repo.UpsertAsync(o);
      return o;
    }

    public async Task DeactivateAsync(string nic)
    {
      var o = await _repo.GetAsync(nic) ?? throw new Exception("EV Owner not found");
      o.IsActive = false;
      await _repo.UpsertAsync(o);
    }
    public async Task ActivateAsync(string nic)
    {
      var o = await _repo.GetAsync(nic) ?? throw new Exception("EV Owner not found");
      o.IsActive = true;
      await _repo.UpsertAsync(o);
    }
    public Task DeleteAsync(string nic) => _repo.DeleteAsync(nic);
    public Task<EVOwner?> GetAsync(string nic) => _repo.GetAsync(nic);
  }
}
