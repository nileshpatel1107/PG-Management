using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGMS.Application.DTOs.Common;
using PGMS.Infrastructure.Data;

namespace PGMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<object>>>> GetAllRoles()
    {
        try
        {
            var roles = await _context.Roles
                .Where(r => r.IsActive && !r.IsDeleted)
                .Select(r => new
                {
                    id = r.Id,
                    name = r.Name,
                    description = r.Description,
                    role_value = r.RoleValue,
                    is_active = r.IsActive,
                    created_at = r.CreatedAt,
                    updated_at = r.UpdatedAt,
                    is_deleted = r.IsDeleted
                })
                .ToListAsync();

            return Ok(new ApiResponse<IEnumerable<object>>
            {
                Success = true,
                Message = "Roles retrieved successfully",
                Data = roles
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<object>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> GetRoleById(Guid id)
    {
        try
        {
            var role = await _context.Roles
                .Where(r => r.Id == id && !r.IsDeleted)
                .Select(r => new
                {
                    id = r.Id,
                    name = r.Name,
                    description = r.Description,
                    role_value = r.RoleValue,
                    is_active = r.IsActive,
                    created_at = r.CreatedAt,
                    updated_at = r.UpdatedAt,
                    is_deleted = r.IsDeleted
                })
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Role not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Role retrieved successfully",
                Data = role
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }
}



