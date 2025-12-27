using Microsoft.EntityFrameworkCore;
using PGMS.Domain.Entities;
using PGMS.Domain.Enums;

namespace PGMS.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedRolesAsync(ApplicationDbContext context)
    {
        // Seed Roles table
        if (!await context.Roles.AnyAsync())
        {
            var roles = new List<RoleEntity>
            {
                new RoleEntity
                {
                    Name = "SuperAdmin",
                    Description = "Super Administrator with full system access",
                    RoleValue = (int)Role.SuperAdmin,
                    IsActive = true
                },
                new RoleEntity
                {
                    Name = "PGAdmin",
                    Description = "PG Administrator who manages a specific PG",
                    RoleValue = (int)Role.PGAdmin,
                    IsActive = true
                },
                new RoleEntity
                {
                    Name = "Staff",
                    Description = "Staff member who assists in PG management",
                    RoleValue = (int)Role.Staff,
                    IsActive = true
                },
                new RoleEntity
                {
                    Name = "Tenant",
                    Description = "Tenant who rents a room in the PG",
                    RoleValue = (int)Role.Tenant,
                    IsActive = true
                }
            };

            context.Roles.AddRange(roles);
            await context.SaveChangesAsync();
        }

        // Create a default SuperAdmin user if none exists
        if (!await context.Users.AnyAsync(u => u.Role == Role.SuperAdmin))
        {
            var superAdmin = new User
            {
                Email = "admin@pgms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = Role.SuperAdmin,
                IsActive = true
            };

            context.Users.Add(superAdmin);
            await context.SaveChangesAsync();
        }
    }
}

