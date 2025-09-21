using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace EVCharge.Backend.Auth
{
  public class PasswordHasher
  {
    public string Hash(string password)
    {
      var salt = RandomNumberGenerator.GetBytes(16);
      var hash = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 10000, 32);
      return Convert.ToBase64String(salt.Concat(hash).ToArray());
    }

    public bool Verify(string password, string stored)
    {
      var data = Convert.FromBase64String(stored);
      var salt = data[..16];
      var hash = data[16..];
      var computed = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 10000, 32);
      return hash.SequenceEqual(computed);
    }
  }
}
