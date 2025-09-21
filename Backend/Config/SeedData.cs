using EVCharge.Backend.Models;
using EVCharge.Backend.Repositories;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace EVCharge.Backend.Config
{
  public static class SeedData
  {
    public static async Task RunAsync(IServiceProvider sp)
    {
      using var scope = sp.CreateScope();
      var ctx = scope.ServiceProvider.GetRequiredService<IMongoContext>();

      // Indices
      var bookings = ctx.Get<Booking>("bookings");
      await bookings.Indexes.CreateOneAsync(new CreateIndexModel<Booking>(
        Builders<Booking>.IndexKeys.Ascending(x => x.StationId).Ascending(x => x.ReservationStart)));

      // Seed a backoffice user if none
      var users = ctx.Get<User>("users");
      if (await users.CountDocumentsAsync(_ => true) == 0)
      {
        var hasher = scope.ServiceProvider.GetRequiredService<Auth.PasswordHasher>();
        await users.InsertOneAsync(new User
        {
          Username = "admin",
          PasswordHash = hasher.Hash("admin123"),
          Role = "Backoffice",
          IsActive = true
        });
      }
    }
  }
}
