namespace PGMS.Application.DTOs.Room;

public class CreateRoomRequest
{
    public Guid PGId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
}

