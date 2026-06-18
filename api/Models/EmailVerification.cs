using System.ComponentModel.DataAnnotations;

namespace api.Models;
public class EmailVerification
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(6)]
    public string Otp { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}