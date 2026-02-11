using PGMS.Application.DTOs.Room;

namespace PGMS.Application.Services;

public interface IRoomService
{
    Task<RoomDto> CreateRoomAsync(CreateRoomRequest request);
    Task<IEnumerable<RoomDto>> GetRoomsByPGIdAsync(Guid pgId);
    Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
    Task<RoomDto> GetRoomByIdAsync(Guid id);
    Task<RoomDto> UpdateRoomAsync(Guid id, UpdateRoomRequest request);
    Task<bool> DeleteRoomAsync(Guid id);
}

