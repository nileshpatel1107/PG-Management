using PGMS.Domain.Enums;

namespace PGMS.Application.DTOs.User;

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Role Role { get; set; }
    public Guid? PGId { get; set; }
    public bool IsActive { get; set; } = true;
}






