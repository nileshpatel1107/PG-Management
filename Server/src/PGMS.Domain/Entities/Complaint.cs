using PGMS.Domain.Enums;

namespace PGMS.Domain.Entities;

public class Complaint : BaseEntity
{
    public Guid TenantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Pending;
    public Guid? AssignedTo { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public User? AssignedUser { get; set; }
}

