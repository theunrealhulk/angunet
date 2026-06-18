using api.Data;
using api.Extensions;
using api.Interfaces;
using api.Services;
using Microsoft.EntityFrameworkCore;
using Hangfire;
using Hangfire.PostgreSql;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);
var connectionString = new ConfigurationService().GetConnectionString();
var appUrl = Environment.GetEnvironmentVariable("APP_URL") ?? "http://localhost:4200";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IConfigurationService, ConfigurationService>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddJwtAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddCors();
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));

// Add the background job server processing engine
builder.Services.AddHangfireServer();
var routeTypes = typeof(Program).Assembly.GetTypes()
    .Where(t => typeof(IRouteMap).IsAssignableFrom(t) && t is { IsInterface: false, IsAbstract: false });
foreach (var type in routeTypes) { builder.Services.AddSingleton(typeof(IRouteMap), type); }

builder.Services.AddValidation();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHangfireDashboard("/hangfire", new DashboardOptions
    {
        Authorization = new[] { new AllowAllDashboardFilter() }
    });
}
else
{
    app.UseHttpsRedirection();
}
app.UseCors(options =>
{
    options.WithOrigins(appUrl)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();  // For cookies/auth
});
app.UseMiddleware<TokenRefreshMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
// Map all endpoints
using (var scope = app.Services.CreateScope())
{
    var endpoints = scope.ServiceProvider.GetRequiredService<IEnumerable<IRouteMap>>();
    foreach (var endpoint in endpoints)
    {
        endpoint.Map(app);
    }
}
app.Run();
