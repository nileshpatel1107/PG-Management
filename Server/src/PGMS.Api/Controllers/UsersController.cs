using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGMS.Application.DTOs.Common;
using PGMS.Application.DTOs.User;
using PGMS.Application.Services;
using PGMS.Domain.Enums;
using System.Security.Claims;

namespace PGMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            var result = await _userService.GetCurrentUserAsync(userId);
            return Ok(new ApiResponse<UserDto>
            {
                Success = true,
                Message = "User retrieved successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllUsers()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<UserDto>>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            var currentUser = await _userService.GetCurrentUserAsync(userId);
            var allUsers = await _userService.GetAllUsersAsync();

            // PGAdmin can only see users in their PG and cannot see SuperAdmin users
            if (currentUser.Role == Role.PGAdmin)
            {
                allUsers = allUsers.Where(u => 
                    u.PGId == currentUser.PGId && 
                    u.Role != Role.SuperAdmin
                );
            }

            return Ok(new ApiResponse<IEnumerable<UserDto>>
            {
                Success = true,
                Message = "Users retrieved successfully",
                Data = allUsers
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<IEnumerable<UserDto>>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            if (roleClaim == null || !Enum.TryParse<Role>(roleClaim.Value, out var currentUserRole))
            {
                return Unauthorized(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid user role",
                    Data = null
                });
            }

            var currentUser = await _userService.GetCurrentUserAsync(userId);
            var result = await _userService.CreateUserAsync(request, currentUserRole, currentUser.PGId);

            return Ok(new ApiResponse<UserDto>
            {
                Success = true,
                Message = "User created successfully",
                Data = result
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,PGAdmin")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid user token",
                    Data = null
                });
            }

            if (roleClaim == null || !Enum.TryParse<Role>(roleClaim.Value, out var currentUserRole))
            {
                return Unauthorized(new ApiResponse<UserDto>
                {
                    Success = false,
                    Message = "Invalid user role",
                    Data = null
                });
            }

            var currentUser = await _userService.GetCurrentUserAsync(userId);
            var result = await _userService.UpdateUserAsync(id, request, currentUserRole, currentUser.PGId);

            return Ok(new ApiResponse<UserDto>
            {
                Success = true,
                Message = "User updated successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<UserDto>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(Guid id)
    {
        try
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            if (roleClaim == null || !Enum.TryParse<Role>(roleClaim.Value, out var currentUserRole))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invalid user role",
                    Data = null
                });
            }

            await _userService.DeleteUserAsync(id, currentUserRole);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User deleted successfully",
                Data = null
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = null
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

