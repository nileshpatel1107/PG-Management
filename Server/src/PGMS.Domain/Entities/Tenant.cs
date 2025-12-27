namespace PGMS.Domain.Entities;

public class Tenant : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid PGId { get; set; }
    public Guid? BedId { get; set; }
    public DateTime JoinDate { get; set; }
    public DateTime? ExitDate { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public PG PG { get; set; } = null!;
    public Bed? Bed { get; set; }
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}

