using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class User
{
    public Guid Id { get; set; }
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    public string? TrustedDevices { get; set; } = string.Empty;
}