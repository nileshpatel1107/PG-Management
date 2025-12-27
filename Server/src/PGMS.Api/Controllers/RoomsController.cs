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

    [HttpGet("{pgId}")]
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
}

