using api.Data;
using api.Models;

namespace api.Interfaces;

public struct AppTokens
{
    public string AccessToken = string.Empty;
    public string RefreshToken = string.Empty;

    public AppTokens()
    {
        AccessToken = string.Empty;
        RefreshToken = string.Empty;
    }
}
public interface ITokenService
{
    public AppTokens CreateTokens(User user);
    public AppTokens? RefreshTokens(ConnectedUser connectedUser, AppDbContext db);
}