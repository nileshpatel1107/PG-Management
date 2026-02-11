using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGMS.Application.DTOs.Common;
using PGMS.Application.DTOs.Room;
using PGMS.Application.Services;

namespace PGMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PGAdmin,Staff")]
    public async Task<ActionResult<ApiResponse<RoomDto>>> CreateRoom([FromBody] CreateRoomRequest request)
    {
        // Validate model state (FluentValidation)
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors)
                .Select(x => x.ErrorMessage)
                .ToList();
            
            return BadRequest(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = string.Join("; ", errors),
                Data = null
            });
        }

        try
        {
            var result = await _roomService.CreateRoomAsync(request);
            return Ok(new ApiResponse<RoomDto>
            {
                Success = true,
                Message = "Room created successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<RoomDto>>>> GetAllRooms()
    {
        try
        {
            var result = await _roomService.GetAllRoomsAsync();
            return Ok(new ApiResponse<IEnumerable<RoomDto>>
            {
                Success = true,
                Message = "Rooms retrieved successfully",
                Data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<RoomDto>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RoomDto>>> GetRoomById(Guid id)
    {
        try
        {
            var result = await _roomService.GetRoomByIdAsync(id);
            return Ok(new ApiResponse<RoomDto>
            {
                Success = true,
                Message = "Room retrieved successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet("pg/{pgId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<RoomDto>>>> GetRoomsByPGId(Guid pgId)
    {
        try
        {
            var result = await _roomService.GetRoomsByPGIdAsync(pgId);
            return Ok(new ApiResponse<IEnumerable<RoomDto>>
            {
                Success = true,
                Message = "Rooms retrieved successfully",
                Data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<RoomDto>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,PGAdmin,Staff")]
    public async Task<ActionResult<ApiResponse<RoomDto>>> UpdateRoom(Guid id, [FromBody] UpdateRoomRequest request)
    {
        try
        {
            var result = await _roomService.UpdateRoomAsync(id, request);
            return Ok(new ApiResponse<RoomDto>
            {
                Success = true,
                Message = "Room updated successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<RoomDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<bool?>>> DeleteRoom(Guid id)
    {
        try
        {
            var result = await _roomService.DeleteRoomAsync(id);
            return Ok(new ApiResponse<bool?>
            {
                Success = true,
                Message = "Room deleted successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<bool?>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<bool?>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }
}

