using EVCharge.Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public class StationRepository
  {
    private readonly IMongoCollection<Station> _col;
    public StationRepository(IMongoContext ctx) => _col = ctx.Get<Station>("stations");

    public Task<Station?> GetAsync(ObjectId id) => _col.Find(x => x.Id == id).FirstOrDefaultAsync();
    public Task InsertAsync(Station s) => _col.InsertOneAsync(s);
    public Task UpdateAsync(Station s) => _col.ReplaceOneAsync(x => x.Id == s.Id, s);
    public Task<List<Station>> ListAsync() => _col.Find(_ => true).ToListAsync();
  }
}
