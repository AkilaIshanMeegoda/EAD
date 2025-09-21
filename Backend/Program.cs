using EVCharge.Backend.Auth;
using EVCharge.Backend.Common;
using EVCharge.Backend.Config;
using EVCharge.Backend.Repositories;
using EVCharge.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Settings
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDb"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// Mongo
builder.Services.AddSingleton<IMongoContext, MongoContext>();

// Repos
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<EVOwnerRepository>();
builder.Services.AddScoped<StationRepository>();
builder.Services.AddScoped<BookingRepository>();

// Services
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEVOwnerService, EVOwnerService>();
builder.Services.AddScoped<IStationService, StationService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IQRService, QRService>();

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = null;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Auth
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(o =>
 {
     o.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = jwt.Issuer,
         ValidAudience = jwt.Audience,
         IssuerSigningKey = key
     };
 });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("BackofficeOnly", p => p.RequireRole("Backoffice"));
    options.AddPolicy("StationOperatorOnly", p => p.RequireRole("StationOperator"));
});

var app = builder.Build();
app.UseMiddleware<ProblemDetailsMiddleware>();

// Swagger in dev
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed default users/indices on first run (safe idempotent)
await SeedData.RunAsync(app.Services);

app.Run();
