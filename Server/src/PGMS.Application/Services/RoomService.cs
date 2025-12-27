using AutoMapper;
using PGMS.Application.DTOs.Room;
using PGMS.Domain.Entities;
using PGMS.Domain.Interfaces;

namespace PGMS.Application.Services;

public class RoomService : IRoomService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RoomService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<RoomDto> CreateRoomAsync(CreateRoomRequest request)
    {
        var pg = await _unitOfWork.PGs.GetByIdAsync(request.PGId);
        if (pg == null)
        {
            throw new KeyNotFoundException("PG not found");
        }

        var room = new Room
        {
            PGId = request.PGId,
            RoomNumber = request.RoomNumber,
            Capacity = request.Capacity,
            IsAvailable = true
        };

        await _unitOfWork.Rooms.AddAsync(room);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<RoomDto>(room);
    }

    public async Task<IEnumerable<RoomDto>> GetRoomsByPGIdAsync(Guid pgId)
    {
        var rooms = await _unitOfWork.Rooms.FindAsync(r => r.PGId == pgId);
        return _mapper.Map<IEnumerable<RoomDto>>(rooms);
    }
}

