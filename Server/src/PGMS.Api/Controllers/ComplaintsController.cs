using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGMS.Application.DTOs.Common;
using PGMS.Application.DTOs.Complaint;
using PGMS.Application.Services;
using PGMS.Domain.Interfaces;
using System.Security.Claims;

namespace PGMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComplaintsController : ControllerBase
{
    private readonly IComplaintService _complaintService;
    private readonly IUnitOfWork _unitOfWork;

    public ComplaintsController(IComplaintService complaintService, IUnitOfWork unitOfWork)
    {
        _complaintService = complaintService;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    [Authorize(Roles = "Tenant")]
    public async Task<ActionResult<ApiResponse<ComplaintDto>>> CreateComplaint([FromBody] CreateComplaintRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<ComplaintDto>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            // Get tenant by user ID
            var tenants = await _unitOfWork.Tenants.FindAsync(t => t.UserId == userId);
            var tenant = tenants.FirstOrDefault();
            if (tenant == null)
            {
                return NotFound(new ApiResponse<ComplaintDto>
                {
                    Success = false,
                    Message = "Tenant not found",
                    Data = null
                });
            }

            var result = await _complaintService.CreateComplaintAsync(request, tenant.Id);
            return Ok(new ApiResponse<ComplaintDto>
            {
                Success = true,
                Message = "Complaint created successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<ComplaintDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<ComplaintDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Tenant")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ComplaintDto>>>> GetMyComplaints()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<ComplaintDto>>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            // Get tenant by user ID
            var tenants = await _unitOfWork.Tenants.FindAsync(t => t.UserId == userId);
            var tenant = tenants.FirstOrDefault();
            if (tenant == null)
            {
                return NotFound(new ApiResponse<IEnumerable<ComplaintDto>>
                {
                    Success = false,
                    Message = "Tenant not found",
                    Data = null
                });
            }

            var result = await _complaintService.GetMyComplaintsAsync(tenant.Id);
            return Ok(new ApiResponse<IEnumerable<ComplaintDto>>
            {
                Success = true,
                Message = "Complaints retrieved successfully",
                Data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<ComplaintDto>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }
}

