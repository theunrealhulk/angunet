using System.ComponentModel.DataAnnotations;

namespace api.Requests;

public record UserRegisterRequest(
    [Required][MinLength(8)][RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
        ErrorMessage = "Password must contain uppercase, lowercase, digit, and symbol")] string Password,
    [Required][StringLength(100, MinimumLength = 3)] string FullName,
    [Required][EmailAddress]
    string Email
);

public record UserLoginRequest(
    [Required][EmailAddress]string Email,
    [Required]string Password
);