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
            IsAvailable = true,
            Description = request.Description,
            FloorNumber = request.FloorNumber,
            RoomType = request.RoomType ?? "Standard",
            Price = request.Price,
            Amenities = request.Amenities ?? new List<string>(),
            Images = request.Images ?? new List<string>(),
            OccupiedBeds = 0
        };

        await _unitOfWork.Rooms.AddAsync(room);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<RoomDto>(room);
    }

    public async Task<IEnumerable<RoomDto>> GetRoomsByPGIdAsync(Guid pgId)
    {
        var rooms = await _unitOfWork.Rooms.FindAsync(r => r.PGId == pgId && !r.IsDeleted);
        return _mapper.Map<IEnumerable<RoomDto>>(rooms);
    }

    public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
    {
        var rooms = await _unitOfWork.Rooms.FindAsync(r => !r.IsDeleted);
        return _mapper.Map<IEnumerable<RoomDto>>(rooms);
    }

    public async Task<RoomDto> GetRoomByIdAsync(Guid id)
    {
        var room = await _unitOfWork.Rooms.GetByIdAsync(id);
        if (room == null || room.IsDeleted)
        {
            throw new KeyNotFoundException("Room not found");
        }
        return _mapper.Map<RoomDto>(room);
    }

    public async Task<RoomDto> UpdateRoomAsync(Guid id, UpdateRoomRequest request)
    {
        var room = await _unitOfWork.Rooms.GetByIdAsync(id);
        if (room == null || room.IsDeleted)
        {
            throw new KeyNotFoundException("Room not found");
        }

        if (!string.IsNullOrEmpty(request.RoomNumber))
            room.RoomNumber = request.RoomNumber;
        
        if (request.Capacity.HasValue)
            room.Capacity = request.Capacity.Value;
        
        if (request.IsAvailable.HasValue)
            room.IsAvailable = request.IsAvailable.Value;
        
        if (request.Description != null)
            room.Description = request.Description;
        
        if (request.FloorNumber.HasValue)
            room.FloorNumber = request.FloorNumber.Value;
        
        if (!string.IsNullOrEmpty(request.RoomType))
            room.RoomType = request.RoomType;
        
        if (request.Price.HasValue)
            room.Price = request.Price.Value;
        
        if (request.Amenities != null)
            room.Amenities = request.Amenities;
        
        if (request.Images != null)
            room.Images = request.Images;

        room.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<RoomDto>(room);
    }

    public async Task<bool> DeleteRoomAsync(Guid id)
    {
        var room = await _unitOfWork.Rooms.GetByIdAsync(id);
        if (room == null || room.IsDeleted)
        {
            throw new KeyNotFoundException("Room not found");
        }

        room.IsDeleted = true;
        room.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}

