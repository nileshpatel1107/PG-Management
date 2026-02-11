namespace PGMS.Application.DTOs.Room;

public class RoomDto
{
    public Guid Id { get; set; }
    public Guid PGId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; }
    public string? Description { get; set; }
    public int? FloorNumber { get; set; }
    public string RoomType { get; set; } = "Standard";
    public decimal? Price { get; set; }
    public List<string> Amenities { get; set; } = new List<string>();
    public List<string> Images { get; set; } = new List<string>();
    public int OccupiedBeds { get; set; }
    public DateTime CreatedAt { get; set; }
}

