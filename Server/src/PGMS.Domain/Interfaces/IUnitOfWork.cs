using PGMS.Domain.Entities;

namespace PGMS.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<RefreshToken> RefreshTokens { get; }
    IRepository<PG> PGs { get; }
    IRepository<Room> Rooms { get; }
    IRepository<Bed> Beds { get; }
    IRepository<Tenant> Tenants { get; }
    IRepository<Complaint> Complaints { get; }
    IRepository<RoleEntity> Roles { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}

