using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGMS.Application.DTOs.Common;
using PGMS.Application.DTOs.PG;
using PGMS.Application.Services;
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

