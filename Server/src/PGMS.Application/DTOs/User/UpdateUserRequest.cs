using PGMS.Domain.Enums;

namespace PGMS.Application.DTOs.User;

public class UpdateUserRequest
{
    public string? Email { get; set; }
    public Role? Role { get; set; }
    public Guid? PGId { get; set; }
    public bool? IsActive { get; set; }
}






