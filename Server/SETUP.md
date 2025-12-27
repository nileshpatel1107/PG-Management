# Quick Setup Guide

## Prerequisites
- .NET 8 SDK installed
- Docker Desktop (optional, for PostgreSQL)

## Quick Start

### Option 1: Using Docker for PostgreSQL

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

2. **Update connection string** in `src/PGMS.Api/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=pgms_db;Username=postgres;Password=postgres"
   }
   ```

3. **Run migrations:**
   ```bash
   cd src/PGMS.Infrastructure
   dotnet ef database update --startup-project ../PGMS.Api
   ```

4. **Run the application:**
   ```bash
   cd src/PGMS.Api
   dotnet run
   ```

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL** and create database:
   ```sql
   CREATE DATABASE pgms_db;
   ```

2. **Update connection string** in `src/PGMS.Api/appsettings.json`

3. **Run migrations:**
   ```bash
   cd src/PGMS.Infrastructure
   dotnet ef database update --startup-project ../PGMS.Api
   ```

4. **Run the application:**
   ```bash
   cd src/PGMS.Api
   dotnet run
   ```

## Default Credentials

After first run, you can login with:
- **Email**: `admin@pgms.com`
- **Password**: `Admin@123`

## Testing the API

1. Open Swagger UI: `https://localhost:5001/swagger`
2. Or import `PGMS_Postman_Collection.json` into Postman

## Troubleshooting

### Migration Issues
If you encounter migration errors, you can:
1. Delete the database and recreate it
2. Or manually run the SQL script: `database/schema.sql`

### Connection Issues
- Ensure PostgreSQL is running
- Check connection string in `appsettings.json`
- Verify firewall settings

### JWT Issues
- Ensure JWT Secret in `appsettings.json` is at least 32 characters
- Clear browser cookies/localStorage if testing in Swagger

