namespace PGMS.Domain.Entities;

public class Room : BaseEntity
{
    public Guid PGId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; } = true;

    // Navigation properties
    public PG PG { get; set; } = null!;
    public ICollection<Bed> Beds { get; set; } = new List<Bed>();
}

