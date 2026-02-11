using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGMS.Application.DTOs.Common;
using PGMS.Application.DTOs.PG;
using PGMS.Application.Services;
using PGMS.Domain.Enums;
using System.Security.Claims;

namespace PGMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PGController : ControllerBase
{
    private readonly IPGService _pgService;

    public PGController(IPGService pgService)
    {
        _pgService = pgService;
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<PGDto>>> CreatePG([FromBody] CreatePGRequest request)
    {
        // Validate model state (FluentValidation)
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            
            return BadRequest(new ApiResponse<PGDto>
            {
                Success = false,
                Message = string.Join("; ", errors),
                Data = null
            });
        }

        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var ownerId))
            {
                return Unauthorized(new ApiResponse<PGDto>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            var result = await _pgService.CreatePGAsync(request, ownerId);
            return Ok(new ApiResponse<PGDto>
            {
                Success = true,
                Message = "PG created successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<PGDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<PGDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PGDto>>>> GetAllPGs()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<PGDto>>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            if (roleClaim == null || !Enum.TryParse<Role>(roleClaim.Value, out var userRole))
            {
                return Unauthorized(new ApiResponse<IEnumerable<PGDto>>
                {
                    Success = false,
                    Message = "Invalid user role",
                    Data = null
                });
            }

            // SuperAdmin sees all PGs, PGAdmin sees only PGs they own
            Guid? filterUserId = userRole == Role.PGAdmin ? userId : null;
            var result = await _pgService.GetAllPGsAsync(filterUserId);

            return Ok(new ApiResponse<IEnumerable<PGDto>>
            {
                Success = true,
                Message = "PGs retrieved successfully",
                Data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<PGDto>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PGDto>>> GetPG(Guid id)
    {
        try
        {
            var result = await _pgService.GetPGByIdAsync(id);
            return Ok(new ApiResponse<PGDto>
            {
                Success = true,
                Message = "PG retrieved successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<PGDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<PGDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }
}

