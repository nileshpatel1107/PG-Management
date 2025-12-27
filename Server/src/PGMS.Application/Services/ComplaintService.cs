using AutoMapper;
using PGMS.Application.DTOs.Complaint;
using PGMS.Domain.Entities;
using PGMS.Domain.Enums;
using PGMS.Domain.Interfaces;

namespace PGMS.Application.Services;

public class ComplaintService : IComplaintService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ComplaintService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ComplaintDto> CreateComplaintAsync(CreateComplaintRequest request, Guid tenantId)
    {
        var tenant = await _unitOfWork.Tenants.GetByIdAsync(tenantId);
        if (tenant == null)
        {
            throw new KeyNotFoundException("Tenant not found");
        }

        var complaint = new Complaint
        {
            TenantId = tenantId,
            Title = request.Title,
            Description = request.Description,
            Status = ComplaintStatus.Pending
        };

        await _unitOfWork.Complaints.AddAsync(complaint);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ComplaintDto>(complaint);
    }

    public async Task<IEnumerable<ComplaintDto>> GetMyComplaintsAsync(Guid tenantId)
    {
        var complaints = await _unitOfWork.Complaints.FindAsync(c => c.TenantId == tenantId);
        return _mapper.Map<IEnumerable<ComplaintDto>>(complaints);
    }
}

