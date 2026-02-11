namespace PGMS.Domain.Entities;

public class Room : BaseEntity
{
    public Guid PGId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? Description { get; set; }
    public int? FloorNumber { get; set; }
    public string RoomType { get; set; } = "Standard";
    public decimal? Price { get; set; }
    public List<string> Amenities { get; set; } = new List<string>();
    public List<string> Images { get; set; } = new List<string>();
    public int OccupiedBeds { get; set; } = 0;

    // Navigation properties
    public PG PG { get; set; } = null!;
    public ICollection<Bed> Beds { get; set; } = new List<Bed>();
}

