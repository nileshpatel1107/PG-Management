using PGMS.Application.DTOs.Room;

namespace PGMS.Application.Services;

public interface IRoomService
{
    Task<RoomDto> CreateRoomAsync(CreateRoomRequest request);
    Task<IEnumerable<RoomDto>> GetRoomsByPGIdAsync(Guid pgId);
}

