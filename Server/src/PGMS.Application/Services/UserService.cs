using AutoMapper;
using PGMS.Application.DTOs.User;
using PGMS.Application.Interfaces;
using PGMS.Domain.Entities;
using PGMS.Domain.Enums;
using PGMS.Domain.Interfaces;

namespace PGMS.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, Role currentUserRole, Guid? currentUserPGId)
    {
        // Role-based permission checks
        if (currentUserRole == Role.SuperAdmin)
        {
            // SuperAdmin can only create PGAdmin
            if (request.Role != Role.PGAdmin)
            {
                throw new UnauthorizedAccessException("SuperAdmin can only create PGAdmin users");
            }
        }
        else if (currentUserRole == Role.PGAdmin)
        {
            // PGAdmin can create Staff and Tenant, and must assign to their PG
            if (request.Role != Role.Staff && request.Role != Role.Tenant)
            {
                throw new UnauthorizedAccessException("PGAdmin can only create Staff and Tenant users");
            }
            if (!currentUserPGId.HasValue)
            {
                throw new InvalidOperationException("PGAdmin must be associated with a PG");
            }
            request.PGId = currentUserPGId; // Force assign to PGAdmin's PG
        }
        else
        {
            throw new UnauthorizedAccessException("You do not have permission to create users");
        }

        // Check if user already exists
        var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email);
        if (existingUsers.Any())
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = request.Role,
            IsActive = request.IsActive,
            PGId = request.PGId
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request, Role currentUserRole, Guid? currentUserPGId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        // Role-based permission checks
        if (currentUserRole == Role.PGAdmin)
        {
            // PGAdmin can only update users in their PG
            if (user.PGId != currentUserPGId)
            {
                throw new UnauthorizedAccessException("You can only update users in your PG");
            }
            // PGAdmin cannot change role to SuperAdmin or PGAdmin
            if (request.Role.HasValue && (request.Role == Role.SuperAdmin || request.Role == Role.PGAdmin))
            {
                throw new UnauthorizedAccessException("You cannot assign this role");
            }
        }
        else if (currentUserRole != Role.SuperAdmin)
        {
            throw new UnauthorizedAccessException("You do not have permission to update users");
        }

        // Update fields
        if (!string.IsNullOrEmpty(request.Email))
        {
            var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email && u.Id != userId);
            if (existingUsers.Any())
            {
                throw new InvalidOperationException("User with this email already exists");
            }
            user.Email = request.Email;
        }

        if (request.Role.HasValue)
        {
            user.Role = request.Role.Value;
        }

        if (request.PGId.HasValue)
        {
            user.PGId = request.PGId;
        }

        if (request.IsActive.HasValue)
        {
            user.IsActive = request.IsActive.Value;
        }

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserDto>(user);
    }

    public async Task DeleteUserAsync(Guid userId, Role currentUserRole)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        // Only SuperAdmin can delete users
        if (currentUserRole != Role.SuperAdmin)
        {
            throw new UnauthorizedAccessException("Only SuperAdmin can delete users");
        }

        // Prevent deleting SuperAdmin
        if (user.Role == Role.SuperAdmin)
        {
            throw new InvalidOperationException("Cannot delete SuperAdmin user");
        }

        await _unitOfWork.Users.DeleteAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }
}

