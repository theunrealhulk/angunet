using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Interfaces;
using api.Models;

public class TokenRefreshMiddleware
{
    private readonly RequestDelegate _next;
    public TokenRefreshMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context, AppDbContext db, ITokenService tokenService)
    {
        var accessToken = context.Request.Cookies["accessToken"];
        var refreshToken = context.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
        {
            await TryRefreshTonesAsync(context, db, tokenService, refreshToken);
        }
        else if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
        {
            if (IsJwtExpired(accessToken))
            {
                await TryRefreshTonesAsync(context, db, tokenService, refreshToken);
            }
        }
        await _next(context);
    }

    private static bool IsJwtExpired(string accessToken)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(accessToken);
            return jwtToken.ValidTo < DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TokenRefresh.IsJwtExpired] Error reading token: {ex.Message}");
            return true;
        }
    }

    private async Task TryRefreshTonesAsync(HttpContext context, AppDbContext db, ITokenService tokenService, string refreshToken)
    {
        var session = await db.ConnectedUsers
                            .Include(c => c.User)
                            .FirstOrDefaultAsync(
                                c => c.RefreshToken == refreshToken
                                && !c.IsRevoked && c.ExpiresAt > DateTime.UtcNow
                            );
        if (session != null)
        {
            if (tokenService.RefreshTokens(session, db) is AppTokens validTokens)
            {
                session.IsRevoked = true;

                db.ConnectedUsers.Add(new ConnectedUser
                {
                    UserId = session.UserId,
                    AccessToken = validTokens.AccessToken,
                    RefreshToken = validTokens.RefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    DeviceInfo = context.Request.Headers.UserAgent.ToString(),
                    IpAddress = context.Connection.RemoteIpAddress?.ToString()
                });
                await db.SaveChangesAsync();
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = context.Request.IsHttps,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                };

                context.Response.Cookies.Append("accessToken", validTokens.AccessToken, new CookieOptions
                {
                    HttpOnly = cookieOptions.HttpOnly,
                    Secure = cookieOptions.Secure,
                    SameSite = cookieOptions.SameSite,
                    Path = cookieOptions.Path,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(15)
                });

                context.Response.Cookies.Append("refreshToken", validTokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = cookieOptions.HttpOnly,
                    Secure = cookieOptions.Secure,
                    SameSite = cookieOptions.SameSite,
                    Path = cookieOptions.Path,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                context.Request.Headers.Append("Authorization", $"Bearer {validTokens.AccessToken}");
            }

        }
    }
}