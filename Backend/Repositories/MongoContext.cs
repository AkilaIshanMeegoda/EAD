using EVCharge.Backend.Config;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public class MongoContext : IMongoContext
  {
    public IMongoDatabase Db { get; }
    public MongoContext(IOptions<MongoDbSettings> opt)
    {
      var client = new MongoClient(opt.Value.ConnectionString);
      Db = client.GetDatabase(opt.Value.Database);
    }
    public IMongoCollection<T> Get<T>(string name) => Db.GetCollection<T>(name);
  }
}
