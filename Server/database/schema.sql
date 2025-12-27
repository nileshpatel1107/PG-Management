-- PG Management System Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL,
    role INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    pg_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- PGs Table
CREATE TABLE IF NOT EXISTS pgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_pgs_users_owner_id FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Add foreign key for users.pg_id
ALTER TABLE users ADD CONSTRAINT fk_users_pgs_pg_id FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE SET NULL;

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_refresh_tokens_users_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pg_id UUID NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_rooms_pgs_pg_id FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE CASCADE
);

-- Beds Table
CREATE TABLE IF NOT EXISTS beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL,
    bed_number VARCHAR(50) NOT NULL,
    is_occupied BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_beds_rooms_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    pg_id UUID NOT NULL,
    bed_id UUID,
    join_date TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_tenants_users_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tenants_pgs_pg_id FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tenants_beds_bed_id FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE SET NULL
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_complaints_tenants_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_complaints_users_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_pg_id ON users(pg_id);
CREATE INDEX IF NOT EXISTS ix_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS ix_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS ix_pgs_owner_id ON pgs(owner_id);
CREATE INDEX IF NOT EXISTS ix_rooms_pg_id ON rooms(pg_id);
CREATE INDEX IF NOT EXISTS ix_beds_room_id ON beds(room_id);
CREATE INDEX IF NOT EXISTS ix_tenants_pg_id ON tenants(pg_id);
CREATE INDEX IF NOT EXISTS ix_tenants_bed_id ON tenants(bed_id);
CREATE INDEX IF NOT EXISTS ix_complaints_tenant_id ON complaints(tenant_id);
CREATE INDEX IF NOT EXISTS ix_complaints_assigned_to ON complaints(assigned_to);

-- Comments
COMMENT ON TABLE users IS 'System users with different roles';
COMMENT ON TABLE pgs IS 'Paying Guest properties';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE rooms IS 'Rooms within a PG';
COMMENT ON TABLE beds IS 'Beds within a room';
COMMENT ON TABLE tenants IS 'Tenants staying in PGs';
COMMENT ON TABLE complaints IS 'Complaints raised by tenants';

