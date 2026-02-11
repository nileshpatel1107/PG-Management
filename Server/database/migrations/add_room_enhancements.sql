-- Migration: Add enhanced fields to rooms table for modern room management
-- Run this migration to add hotel-style features to rooms

-- Add new columns to rooms table
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS room_type VARCHAR(50) DEFAULT 'Standard',
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS occupied_beds INTEGER DEFAULT 0;

-- Add index for room_type for faster filtering
CREATE INDEX IF NOT EXISTS ix_rooms_room_type ON rooms(room_type);

-- Add index for floor_number
CREATE INDEX IF NOT EXISTS ix_rooms_floor_number ON rooms(floor_number);

-- Update is_available to be calculated based on occupied_beds vs capacity
-- This is a computed column approach - we'll handle this in the application layer
-- But we can add a check constraint
ALTER TABLE rooms 
ADD CONSTRAINT chk_rooms_occupied_beds 
CHECK (occupied_beds >= 0 AND occupied_beds <= capacity);

-- Add comments
COMMENT ON COLUMN rooms.description IS 'Room description and details';
COMMENT ON COLUMN rooms.floor_number IS 'Floor number where the room is located';
COMMENT ON COLUMN rooms.room_type IS 'Type of room (Standard, Deluxe, Premium, etc.)';
COMMENT ON COLUMN rooms.price IS 'Monthly rent price for the room';
COMMENT ON COLUMN rooms.amenities IS 'Array of amenities available in the room';
COMMENT ON COLUMN rooms.images IS 'Array of image URLs for the room';
COMMENT ON COLUMN rooms.occupied_beds IS 'Number of beds currently occupied in the room';

