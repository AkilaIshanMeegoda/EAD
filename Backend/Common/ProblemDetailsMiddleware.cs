using System.Net;
using System.Text.Json;

namespace EVCharge.Backend.Common
{
  public class ProblemDetailsMiddleware
  {
    private readonly RequestDelegate _next;
    public ProblemDetailsMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext ctx)
    {
      try { await _next(ctx); }
      catch (ValidationException ve)
      {
        ctx.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { error = ve.Message, details = ve.Errors }));
      }
      catch (Exception ex)
      {
        ctx.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { error = "ServerError", message = ex.Message }));
      }
    }
  }
}
