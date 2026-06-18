using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Data;
using api.Models;
using api.Interfaces;
using api.Requests;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using Hangfire;
using api.Responses;

namespace api.Endpoints;

public class AuthEndpoints : IRouteMap
{
    public void Map(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth")
            .WithTags("Auth");
        group.MapPost("/login", Login);
        group.MapGet("/me", GetCurrentUser).RequireAuthorization();
        group.MapPost("/verify-code", VerifyCode);
        group.MapPost("/send-code", SendEmailVerificationCode);
        group.MapPost("/register", Register);
        group.MapPost("/logout", Logout).RequireAuthorization();
    }

    private async Task<IResult> GetCurrentUser(HttpContext context, AppDbContext db)
    {
        var email = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        Console.WriteLine("Getting current user for email: " + email);
        if (email == null)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "User not found",
                StatusCode = StatusCodes.Status401Unauthorized,
                Data = null
            }, statusCode: StatusCodes.Status401Unauthorized);
        }
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "User not found",
                StatusCode = StatusCodes.Status401Unauthorized,
                Data = null
            }, statusCode: StatusCodes.Status401Unauthorized);
        }
        var response = new ApiResponse<User>
        {
            Success = true,
            Message = "Current user retrieved successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = user
        };
        return Results.Json(response, statusCode: StatusCodes.Status200OK);
    }
    private async Task<IResult> SendEmailVerificationCode(EmailVerificationRequest context, AppDbContext db, IEmailService emailService, IBackgroundJobClient backgroundJobs)
    {
        Console.WriteLine("Sending email verification code to " + context.Email);
        string code = new Random().Next(0, 9999).ToString("D4");
        string email = context.Email;
        if (email == null || !new EmailAddressAttribute().IsValid(email))
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid email address",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            }, statusCode: StatusCodes.Status400BadRequest);
        }
        var existingVerification = await db.EmailVerifications.FirstOrDefaultAsync(v => v.Email == email);
        if (existingVerification != null && existingVerification.ExpiresAt > DateTime.UtcNow)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = true,
                Message = "A verification code has already been sent to this email. Please check your inbox.",
                StatusCode = StatusCodes.Status200OK,
                Data = null
            }, statusCode: StatusCodes.Status200OK);
        }
        else if (existingVerification != null)
        {
            db.EmailVerifications.Remove(existingVerification);
            await db.SaveChangesAsync();
        }
        else
        {
            var emailVerification = new EmailVerification
            {
                Email = email,
                Otp = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };
            Console.WriteLine("Saving email verification code to database for " + context.Email);
            await db.EmailVerifications.AddAsync(emailVerification);
            await db.SaveChangesAsync();
            await emailService.SendEmailOtpAsync(context.Email, code, "AnguNet Verification Code", "Please use the following code to verify your email address.");
            // Schedule a hangfire background job to delete the verification code after 5 minutes
            backgroundJobs.Schedule<AppDbContext>(
            db => db.DeleteVerificationCodeAsync(email),
            TimeSpan.FromMinutes(5)
        );

        }

        return Results.Json(new ApiResponse<object>
        {
            Success = true,
            Message = "Email verification code sent successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = null
        }, statusCode: StatusCodes.Status200OK);
    }

    private async Task<IResult> VerifyCode(CodeVerificationRequest context, AppDbContext db)
    {
        var emailVerification = await db.EmailVerifications.FirstOrDefaultAsync(v => v.Email == context.Email && v.Otp == context.Code);
        if (emailVerification == null)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid code or email",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            }, statusCode: StatusCodes.Status400BadRequest);
        }
        if (emailVerification.ExpiresAt < DateTime.UtcNow)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "Code has expired",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            }, statusCode: StatusCodes.Status400BadRequest);
        }
        if (emailVerification.Otp != context.Code)
        {
            return Results.Json(new ApiResponse<object>
            {
                Success = false,
                Message = "Code does not match the email",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            }, statusCode: StatusCodes.Status400BadRequest);
        }
        else
        {
            db.EmailVerifications.Remove(emailVerification);
            //delete the verification code from database
            await db.SaveChangesAsync();
        }
        return Results.Json(new ApiResponse<object>
        {
            Success = true,
            Message = "Code verified successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = null
        }, statusCode: StatusCodes.Status200OK);
    }

    private static async Task<IResult> Register(UserRegisterRequest request, AppDbContext db)
    {
        if (await db.Users.AnyAsync(x => x.Email == request.Email))
        {
            var errorResponse = new ApiResponse<object>
            {
                Success = false,
                Message = "Username or email already exists",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            };
            return Results.Json(errorResponse, statusCode: StatusCodes.Status400BadRequest);
        }
        var user = new User();
        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);
        user.PasswordHash = hashedPassword;
        user.FullName = request.FullName;
        user.Email = request.Email;

        db.Users.Add(user);
        await db.SaveChangesAsync();
        var successResponse = new ApiResponse<User>
        {
            Success = true,
            Message = "User registered successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = user
        };
        return Results.Json(successResponse, statusCode: StatusCodes.Status200OK);
    }

    private static async Task<IResult> Login(UserLoginRequest request, AppDbContext db, ITokenService tokenService, HttpContext context)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null || new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password) ==
            PasswordVerificationResult.Failed)
        {
            var errorResponse = new ApiResponse<object>
            {
                Success = false,
                Message = "Username or password is incorrect",
                StatusCode = StatusCodes.Status400BadRequest,
                Data = null
            };
            return Results.Json(errorResponse, statusCode: StatusCodes.Status400BadRequest);
        }
        var deviceInfo = context.Request.Headers.UserAgent.ToString();
        var ipAddress = context.Connection.RemoteIpAddress?.ToString();
        // Check if session from same device already exists
        var existingSession = await db.ConnectedUsers
            .Where(c => c.UserId == user.Id
                        && !c.IsRevoked
                        && c.ExpiresAt > DateTime.UtcNow
                        && c.DeviceInfo == deviceInfo
                        && c.IpAddress == ipAddress)
            .FirstOrDefaultAsync();

        // Revoke old token for this device if exists
        existingSession?.IsRevoked = true;
        var t = tokenService.CreateTokens(user);
        //check if device is agent
        Console.WriteLine(context.Request.Headers.Referer.ToString());
        db.ConnectedUsers.Add(new ConnectedUser
        {
            UserId = user.Id,
            AccessToken = t.AccessToken,
            RefreshToken = t.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            DeviceInfo = context.Request.Headers.UserAgent.ToString(),
            IpAddress = context.Connection.RemoteIpAddress?.ToString()
        });
        await db.SaveChangesAsync();
        var commonCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = context.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/"
        };

        context.Response.Cookies.Append("accessToken", t.AccessToken, new CookieOptions
        {
            HttpOnly = commonCookieOptions.HttpOnly,
            Secure = commonCookieOptions.Secure,
            SameSite = commonCookieOptions.SameSite,
            Path = commonCookieOptions.Path,
            Expires = DateTimeOffset.UtcNow.AddMinutes(15),
        });
        context.Response.Cookies.Append("refreshToken", t.RefreshToken, new CookieOptions
        {
            HttpOnly = commonCookieOptions.HttpOnly,
            Secure = commonCookieOptions.Secure,
            SameSite = commonCookieOptions.SameSite,
            Path = commonCookieOptions.Path,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
        });
        var successResponse = new ApiResponse<string>
        {
            Success = true,
            Message = "Login successful",
            StatusCode = StatusCodes.Status200OK,
            Data = null
        };
        return Results.Json(successResponse, statusCode: StatusCodes.Status200OK);
    }
    private static async Task<IResult> Logout(HttpContext context, AppDbContext db)
    {
        // 1. Retrieve the refresh token from the incoming cookies
        var refreshToken = context.Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            // 2. Find the matching session row in the database
            var session = await db.ConnectedUsers
                .FirstOrDefaultAsync(c => c.RefreshToken == refreshToken);

            if (session != null)
            {
                db.ConnectedUsers.Remove(session);
                await db.SaveChangesAsync();
            }
        }


        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = context.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.UnixEpoch
        };

        context.Response.Cookies.Delete("accessToken", cookieOptions);
        context.Response.Cookies.Delete("refreshToken", cookieOptions);

        var successResponse = new ApiResponse<object>
        {
            Success = true,
            Message = "Logged out successfully",
            StatusCode = StatusCodes.Status200OK,
            Data = null
        };

        return Results.Json(successResponse, statusCode: StatusCodes.Status200OK);
    }
}