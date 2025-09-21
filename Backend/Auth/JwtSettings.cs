namespace EVCharge.Backend.Auth
{
  public class JwtSettings
  {
    public string Issuer { get; set; } = default!;
    public string Audience { get; set; } = default!;
    public string Key { get; set; } = default!;
    public int ExpiresMinutes { get; set; }
  }
}
