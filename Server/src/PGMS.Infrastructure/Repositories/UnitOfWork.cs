using PGMS.Domain.Entities;
using PGMS.Domain.Interfaces;
using PGMS.Infrastructure.Data;

namespace PGMS.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IRepository<User>? _users;
    private IRepository<RefreshToken>? _refreshTokens;
    private IRepository<PG>? _pgs;
    private IRepository<Room>? _rooms;
    private IRepository<Bed>? _beds;
    private IRepository<Tenant>? _tenants;
    private IRepository<Complaint>? _complaints;
    private IRepository<RoleEntity>? _roles;
    private Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction? _transaction;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<User> Users =>
        _users ??= new Repository<User>(_context);

    public IRepository<RefreshToken> RefreshTokens =>
        _refreshTokens ??= new Repository<RefreshToken>(_context);

    public IRepository<PG> PGs =>
        _pgs ??= new Repository<PG>(_context);

    public IRepository<Room> Rooms =>
        _rooms ??= new Repository<Room>(_context);

    public IRepository<Bed> Beds =>
        _beds ??= new Repository<Bed>(_context);

    public IRepository<Tenant> Tenants =>
        _tenants ??= new Repository<Tenant>(_context);

    public IRepository<Complaint> Complaints =>
        _complaints ??= new Repository<Complaint>(_context);

    public IRepository<RoleEntity> Roles =>
        _roles ??= new Repository<RoleEntity>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}

