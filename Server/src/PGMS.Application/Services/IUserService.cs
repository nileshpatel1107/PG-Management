using PGMS.Application.DTOs.User;
using PGMS.Domain.Enums;

namespace PGMS.Application.Services;

public interface IUserService
{
    Task<UserDto> GetCurrentUserAsync(Guid userId);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(CreateUserRequest request, Role currentUserRole, Guid? currentUserPGId);
    Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request, Role currentUserRole, Guid? currentUserPGId);
    Task DeleteUserAsync(Guid userId, Role currentUserRole);
}

