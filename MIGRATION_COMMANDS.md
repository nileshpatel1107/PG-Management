# Database Migration Commands

## Room Management Enhancements Migration

This migration adds modern hotel-style features to the rooms table.

## ✅ Automatic Migration (Recommended)

**The application will automatically apply migrations on startup!** 

When you run the application, it will:
1. Check for pending migrations
2. Automatically apply them to the database
3. Seed default data

**No manual steps required!** Just run:
```bash
cd Server/src/PGMS.Api
dotnet run
```

---

## Manual Migration (Alternative)

If you prefer to run migrations manually, you can use:

### Option 1: Entity Framework Core Migration (Recommended)

```bash
# Navigate to Infrastructure project
cd Server/src/PGMS.Infrastructure

# Apply the migration
dotnet ef database update --startup-project ../PGMS.Api
```

### Option 2: Direct SQL Script

Run the following SQL script to add the new columns to your rooms table:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database_name

# Then run the migration script
\i Server/database/migrations/add_room_enhancements.sql
```

Or execute the SQL directly:

```sql
-- Add new columns to rooms table
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS room_type VARCHAR(50) DEFAULT 'Standard',
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS occupied_beds INTEGER DEFAULT 0;

-- Add indexes
CREATE INDEX IF NOT EXISTS ix_rooms_room_type ON rooms(room_type);
CREATE INDEX IF NOT EXISTS ix_rooms_floor_number ON rooms(floor_number);

-- Add constraint
ALTER TABLE rooms 
ADD CONSTRAINT chk_rooms_occupied_beds 
CHECK (occupied_beds >= 0 AND occupied_beds <= capacity);
```

### Entity Framework Migration (if using EF Core)

If you're using Entity Framework Core migrations, you'll need to create a new migration:

```bash
# Navigate to the Infrastructure project
cd Server/src/PGMS.Infrastructure

# Create a new migration
dotnet ef migrations add AddRoomEnhancements --startup-project ../PGMS.Api

# Apply the migration
dotnet ef database update --startup-project ../PGMS.Api
```

### Verification

After running the migration, verify the changes:

```sql
-- Check the table structure
\d rooms

-- Verify columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'rooms' 
AND column_name IN ('description', 'floor_number', 'room_type', 'price', 'amenities', 'images', 'occupied_beds');
```

### Rollback (if needed)

If you need to rollback the migration:

```sql
ALTER TABLE rooms 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS floor_number,
DROP COLUMN IF EXISTS room_type,
DROP COLUMN IF EXISTS price,
DROP COLUMN IF EXISTS amenities,
DROP COLUMN IF EXISTS images,
DROP COLUMN IF EXISTS occupied_beds;

DROP INDEX IF EXISTS ix_rooms_room_type;
DROP INDEX IF EXISTS ix_rooms_floor_number;

ALTER TABLE rooms DROP CONSTRAINT IF EXISTS chk_rooms_occupied_beds;
```
