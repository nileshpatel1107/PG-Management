# PG Management System - Backend API

A production-ready .NET 8 Web API for a Paying Guest (PG) Management SaaS Application built with Clean Architecture principles.

## 🏗️ Architecture

The solution follows **Clean Architecture** with the following layers:

```
/src
 ├── PGMS.Api          # Presentation Layer (Controllers, Middleware)
 ├── PGMS.Application  # Application Layer (Services, DTOs, Validators)
 ├── PGMS.Domain       # Domain Layer (Entities, Interfaces, Enums)
 └── PGMS.Infrastructure # Infrastructure Layer (DbContext, Repositories, JWT)
```

## 🚀 Features

- ✅ **Clean Architecture** with SOLID principles
- ✅ **JWT Authentication** with Refresh Token support
- ✅ **Role-Based Access Control (RBAC)**: SuperAdmin, PGAdmin, Staff, Tenant
- ✅ **PostgreSQL** database with EF Core
- ✅ **Repository Pattern** & Unit of Work
- ✅ **AutoMapper** for DTO mapping
- ✅ **FluentValidation** for request validation
- ✅ **Global Exception Handling**
- ✅ **Soft Delete** support
- ✅ **Audit Fields** (CreatedAt, UpdatedAt)
- ✅ **Swagger** with JWT authentication
- ✅ **BCrypt** password hashing

## 📋 Prerequisites

- .NET 8 SDK
- PostgreSQL 12+ (or Docker)
- Visual Studio 2022 / VS Code / Rider

## 🔧 Setup Instructions

### 1. Clone and Restore

```bash
# Restore NuGet packages
dotnet restore
```

### 2. Configure Database

Update `appsettings.json` with your PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=pgms_db;Username=postgres;Password=your_password"
  }
}
```

### 3. Create Database

**Option A: Using EF Core Migrations (Recommended)**

```bash
# Navigate to Infrastructure project
cd src/PGMS.Infrastructure

# Create migration
dotnet ef migrations add InitialCreate --startup-project ../PGMS.Api

# Apply migration
dotnet ef database update --startup-project ../PGMS.Api
```

**Option B: Using SQL Script**

```bash
# Create database
psql -U postgres -c "CREATE DATABASE pgms_db;"

# Run schema script
psql -U postgres -d pgms_db -f database/schema.sql
```

### 4. Configure JWT Secret

Update `appsettings.json` with a strong JWT secret (minimum 32 characters):

```json
{
  "Jwt": {
    "Secret": "YourSuperSecretKeyForJWTTokenGenerationThatShouldBeAtLeast32CharactersLong"
  }
}
```

### 5. Run the Application

```bash
# From solution root
dotnet run --project src/PGMS.Api

# Or
cd src/PGMS.Api
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## 🔐 Default Credentials

After running migrations, a default SuperAdmin user is created:

- **Email**: `admin@pgms.com`
- **Password**: `Admin@123`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |

### Users

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users/me` | Get current user | Yes | All |
| GET | `/api/users` | Get all users | Yes | SuperAdmin |

### PG (Properties)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/pg` | Create PG | Yes | SuperAdmin, PGAdmin |
| GET | `/api/pg/{id}` | Get PG by ID | Yes | All |

### Rooms

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/rooms` | Create room | Yes | SuperAdmin, PGAdmin, Staff |
| GET | `/api/rooms/{pgId}` | Get rooms by PG ID | Yes | All |

### Complaints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/complaints` | Create complaint | Yes | Tenant |
| GET | `/api/complaints/my` | Get my complaints | Yes | Tenant |

## 📦 Postman Collection

Import `PGMS_Postman_Collection.json` into Postman for easy API testing.

The collection includes:
- Pre-configured authentication
- Auto token refresh
- All API endpoints with examples

## 🗄️ Database Schema

### Core Entities

- **User**: System users with roles
- **RefreshToken**: JWT refresh tokens
- **PG**: Paying Guest properties
- **Room**: Rooms within a PG
- **Bed**: Beds within a room
- **Tenant**: Tenants staying in PGs
- **Complaint**: Complaints raised by tenants

### Relationships

- User → PG (Owner)
- User → Tenant (1:1)
- PG → Room (1:Many)
- Room → Bed (1:Many)
- Tenant → Bed (1:1)
- Tenant → Complaint (1:Many)

## 🔒 Security Features

- **JWT Access Tokens**: 15-minute expiry
- **Refresh Tokens**: 7-day expiry, stored hashed in DB
- **Token Rotation**: New refresh token on each refresh
- **Password Hashing**: BCrypt with salt
- **Role-Based Authorization**: Enforced at controller level
- **Soft Delete**: Data retention with IsDeleted flag

## 📝 Response Format

All APIs return a standard response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

## 🧪 Testing

### Register a User

```bash
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "role": "Tenant"
  }'
```

### Login

```bash
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pgms.com",
    "password": "Admin@123"
  }'
```

## 🛠️ Development

### Adding a New Entity

1. Create entity in `PGMS.Domain/Entities`
2. Create configuration in `PGMS.Infrastructure/Data/Configurations`
3. Add to `ApplicationDbContext`
4. Add repository to `IUnitOfWork`
5. Create DTOs in `PGMS.Application/DTOs`
6. Create service in `PGMS.Application/Services`
7. Create controller in `PGMS.Api/Controllers`
8. Create migration: `dotnet ef migrations add AddNewEntity --startup-project ../PGMS.Api`

### Running Migrations

```bash
# Create migration
dotnet ef migrations add MigrationName --project src/PGMS.Infrastructure --startup-project src/PGMS.Api

# Update database
dotnet ef database update --project src/PGMS.Infrastructure --startup-project src/PGMS.Api
```

## 📚 Technology Stack

- **.NET 8** - Framework
- **Entity Framework Core 8** - ORM
- **PostgreSQL** - Database
- **JWT Bearer** - Authentication
- **BCrypt.Net** - Password Hashing
- **AutoMapper** - Object Mapping
- **FluentValidation** - Request Validation
- **Swagger** - API Documentation

## 🎯 Next Steps

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Implement pagination
- [ ] Add filtering and sorting
- [ ] Implement file uploads
- [ ] Add email notifications
- [ ] Implement payment integration
- [ ] Add audit logging
- [ ] Implement caching

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions, please open an issue in the repository.

