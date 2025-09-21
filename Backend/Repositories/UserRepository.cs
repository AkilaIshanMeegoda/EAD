using EVCharge.Backend.Models;
using MongoDB.Driver;

namespace EVCharge.Backend.Repositories
{
  public class UserRepository
  {
    private readonly IMongoCollection<User> _col;
    public UserRepository(IMongoContext ctx) => _col = ctx.Get<User>("users");

    public Task<User?> FindByUsernameAsync(string username) =>
      _col.Find(u => u.Username == username).FirstOrDefaultAsync();

    public Task InsertAsync(User u) => _col.InsertOneAsync(u);
    public Task UpdateAsync(User u) =>
      _col.ReplaceOneAsync(x => x.Id == u.Id, u);
  }
}
