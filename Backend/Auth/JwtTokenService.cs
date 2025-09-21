using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EVCharge.Backend.Auth
{
  public class JwtTokenService
  {
    private readonly JwtSettings _s;
    public JwtTokenService(IOptions<JwtSettings> opt) { _s = opt.Value; }

    public string Create(string username, string role)
    {
      var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_s.Key)), SecurityAlgorithms.HmacSha256);
      var token = new JwtSecurityToken(_s.Issuer, _s.Audience,
        new[] { new Claim(ClaimTypes.Name, username), new Claim(ClaimTypes.Role, role) },
        expires: DateTime.UtcNow.AddMinutes(_s.ExpiresMinutes), signingCredentials: creds);
      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
