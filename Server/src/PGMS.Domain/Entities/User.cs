using PGMS.Domain.Enums;

namespace PGMS.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? PGId { get; set; }

    // Navigation properties
    public PG? PG { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public Tenant? Tenant { get; set; }
}

