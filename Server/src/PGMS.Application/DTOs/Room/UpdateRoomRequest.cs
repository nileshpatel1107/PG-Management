namespace PGMS.Application.DTOs.Room;

public class UpdateRoomRequest
{
    public string? RoomNumber { get; set; }
    public int? Capacity { get; set; }
    public bool? IsAvailable { get; set; }
    public string? Description { get; set; }
    public int? FloorNumber { get; set; }
    public string? RoomType { get; set; }
    public decimal? Price { get; set; }
    public List<string>? Amenities { get; set; }
    public List<string>? Images { get; set; }
}

