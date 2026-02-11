using AutoMapper;
using PGMS.Application.DTOs.PG;
using PGMS.Domain.Entities;
using PGMS.Domain.Interfaces;

namespace PGMS.Application.Services;

public class PGService : IPGService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PGService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PGDto> CreatePGAsync(CreatePGRequest request, Guid ownerId)
    {
        var owner = await _unitOfWork.Users.GetByIdAsync(ownerId);
        if (owner == null)
        {
            throw new KeyNotFoundException("Owner not found");
        }

        var pg = new PG
        {
            Name = request.Name,
            Address = request.Address,
            OwnerId = ownerId
        };

        await _unitOfWork.PGs.AddAsync(pg);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<PGDto>(pg);
    }

    public async Task<PGDto> GetPGByIdAsync(Guid id)
    {
        var pg = await _unitOfWork.PGs.GetByIdAsync(id);
        if (pg == null)
        {
            throw new KeyNotFoundException("PG not found");
        }

        return _mapper.Map<PGDto>(pg);
    }

    public async Task<IEnumerable<PGDto>> GetAllPGsAsync(Guid? userId = null)
    {
        IEnumerable<PG> pgs;
        
        if (userId.HasValue)
        {
            // Filter by owner ID (for PGAdmin - they only see PGs they own)
            pgs = await _unitOfWork.PGs.FindAsync(pg => pg.OwnerId == userId.Value);
        }
        else
        {
            // Get all PGs (for SuperAdmin)
            pgs = await _unitOfWork.PGs.GetAllAsync();
        }

        return _mapper.Map<IEnumerable<PGDto>>(pgs);
    }
}

