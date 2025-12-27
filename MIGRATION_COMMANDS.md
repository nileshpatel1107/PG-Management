# Database Migration Commands

## Create Migration for Roles Table

Navigate to the Infrastructure project and run:

```bash
cd Server/src/PGMS.Infrastructure
dotnet ef migrations add AddRolesTable --startup-project ../PGMS.Api
```

## Apply Migration

```bash
dotnet ef database update --startup-project ../PGMS.Api
```

## Verify Migration

The migration will:
1. Create `roles` table with columns:
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR(100), Unique)
   - `description` (VARCHAR(500))
   - `role_value` (INTEGER, Unique) - Maps to Role enum
   - `is_active` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
   - `is_deleted` (BOOLEAN)

2. Seed initial roles:
   - SuperAdmin (RoleValue: 1)
   - PGAdmin (RoleValue: 2)
   - Staff (RoleValue: 3)
   - Tenant (RoleValue: 4)

3. Create default SuperAdmin user if none exists:
   - Email: `admin@pgms.com`
   - Password: `Admin@123`






