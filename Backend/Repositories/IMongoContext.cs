using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public interface IMongoContext
  {
    IMongoDatabase Db { get; }
    IMongoCollection<T> Get<T>(string name);
  }
}
