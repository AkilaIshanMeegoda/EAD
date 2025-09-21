using EVCharge.Backend.Models;
using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public class EVOwnerRepository
  {
    private readonly IMongoCollection<EVOwner> _col;
    public EVOwnerRepository(IMongoContext ctx) => _col = ctx.Get<EVOwner>("evowners");

    public Task<EVOwner?> GetAsync(string nic) => _col.Find(x => x.NIC == nic).FirstOrDefaultAsync();
    public Task UpsertAsync(EVOwner o) =>
      _col.ReplaceOneAsync(x => x.NIC == o.NIC, o, new ReplaceOptions { IsUpsert = true });
    public Task DeleteAsync(string nic) => _col.DeleteOneAsync(x => x.NIC == nic);
    public async Task<bool> ExistsAsync(string nic) => (await _col.CountDocumentsAsync(x => x.NIC == nic)) > 0;
  }
}
