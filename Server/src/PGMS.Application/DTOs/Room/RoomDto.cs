namespace PGMS.Application.DTOs.Room;

public class RoomDto
{
    public Guid Id { get; set; }
    public Guid PGId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
}

