using System.ComponentModel.DataAnnotations;

namespace api.Requests;

public record EmailVerificationRequest(
    [Required][EmailAddress] string Email
);

public record CodeVerificationRequest(
    [Required][StringLength(4, MinimumLength = 4)] string Code,
    [Required][EmailAddress] string Email
);
