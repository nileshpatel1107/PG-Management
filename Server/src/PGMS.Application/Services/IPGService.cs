using PGMS.Application.DTOs.PG;

namespace PGMS.Application.Services;

public interface IPGService
{
    Task<PGDto> CreatePGAsync(CreatePGRequest request, Guid ownerId);
    Task<PGDto> GetPGByIdAsync(Guid id);
}

