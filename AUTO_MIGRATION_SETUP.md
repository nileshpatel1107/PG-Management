# Automatic Database Migration Setup

## ✅ Automatic Migration is Now Enabled!

Your application is now configured to **automatically apply database migrations** when it starts.

## How It Works

When you run the application, the `Program.cs` file will:

1. **Check for pending migrations** in the database
2. **Automatically apply** any new migrations
3. **Seed default data** (roles, etc.)
4. **Log the process** for monitoring

## What Changed

### Program.cs Updates

The application startup code was updated from:
```csharp
context.Database.EnsureCreated(); // Only creates database, doesn't use migrations
```

To:
```csharp
await context.Database.MigrateAsync(); // Automatically applies pending migrations
```

### Migration Created

A new Entity Framework Core migration was created:
- **Migration Name**: `AddRoomEnhancements`
- **File**: `Server/src/PGMS.Infrastructure/Migrations/20251227182014_AddRoomEnhancements.cs`
- **Adds**: All new room enhancement fields (description, floor_number, room_type, price, amenities, images, occupied_beds)

## Running the Application

### First Time Setup

1. **Ensure PostgreSQL is running**
2. **Update connection string** in `Server/src/PGMS.Api/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=pgms_db;Username=postgres;Password=your_password"
     }
   }
   ```

3. **Run the application**:
   ```bash
   cd Server/src/PGMS.Api
   dotnet run
   ```

The application will:
- ✅ Create the database if it doesn't exist
- ✅ Apply all migrations automatically
- ✅ Seed default data
- ✅ Start the API server

### Subsequent Runs

Just run the application normally:
```bash
cd Server/src/PGMS.Api
dotnet run
```

Any new migrations will be applied automatically!

## Migration Logs

You'll see migration logs in the console:
```
info: Applying database migrations...
info: Database migrations applied successfully.
```

## Troubleshooting

### Migration Fails on Startup

If migrations fail, the application will:
- Log the error
- **Stop the application** (to prevent running with invalid database state)
- Show the error in the console

**Solution**: Fix the database connection or migration issues, then restart.

### Manual Migration Rollback

If you need to rollback a migration manually:
```bash
cd Server/src/PGMS.Infrastructure
dotnet ef database update PreviousMigrationName --startup-project ../PGMS.Api
```

### Disable Auto-Migration (Not Recommended)

If you need to disable automatic migrations (for production with manual deployment), comment out the migration code in `Program.cs`:

```csharp
// await context.Database.MigrateAsync(); // Commented out for manual migration
```

## Production Considerations

For production environments, you may want to:
1. **Run migrations manually** during deployment
2. **Use migration scripts** in CI/CD pipelines
3. **Monitor migration logs** carefully

However, for development, automatic migrations are very convenient!

## Benefits

✅ **No manual steps** - Just run the app
✅ **Always up-to-date** - Database schema matches code
✅ **Safe** - Only applies pending migrations
✅ **Idempotent** - Can run multiple times safely
✅ **Logged** - See what migrations were applied

---

**Your application is now ready to automatically handle database migrations!** 🚀

