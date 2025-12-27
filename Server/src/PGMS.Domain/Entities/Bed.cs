namespace PGMS.Domain.Entities;

public class Bed : BaseEntity
{
    public Guid RoomId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public bool IsOccupied { get; set; } = false;

    // Navigation properties
    public Room Room { get; set; } = null!;
    public Tenant? Tenant { get; set; }
}

