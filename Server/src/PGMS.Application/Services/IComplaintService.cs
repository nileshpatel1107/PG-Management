using PGMS.Application.DTOs.Complaint;

namespace PGMS.Application.Services;

public interface IComplaintService
{
    Task<ComplaintDto> CreateComplaintAsync(CreateComplaintRequest request, Guid tenantId);
    Task<IEnumerable<ComplaintDto>> GetMyComplaintsAsync(Guid tenantId);
}

