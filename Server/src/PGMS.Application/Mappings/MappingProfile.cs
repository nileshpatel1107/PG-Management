using AutoMapper;
using PGMS.Application.DTOs.Complaint;
using PGMS.Application.DTOs.PG;
using PGMS.Application.DTOs.Room;
using PGMS.Application.DTOs.User;
using PGMS.Domain.Entities;

namespace PGMS.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<PG, PGDto>();
        CreateMap<Room, RoomDto>();
        CreateMap<Complaint, ComplaintDto>();
    }
}

