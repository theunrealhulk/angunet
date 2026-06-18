
namespace api.Models;

public class ConnectedUser
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;
    public string? DeviceInfo { get; set; }
    public string? IpAddress { get; set; }
    
    public User User { get; set; } = null!;
}