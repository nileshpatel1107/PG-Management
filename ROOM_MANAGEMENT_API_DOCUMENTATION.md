# Room Management API Documentation

## Overview
Complete API documentation for the modern Room Management System with hotel-style features.

## Base URL
```
/api/rooms
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## API Endpoints

### 1. Get All Rooms
Retrieve all rooms across all PGs.

**Endpoint:** `GET /api/rooms`

**Authorization:** Required (All authenticated users)

**Response:**
```json
{
  "success": true,
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "pgId": "uuid",
      "roomNumber": "101",
      "capacity": 4,
      "isAvailable": true,
      "description": "Spacious room with balcony",
      "floorNumber": 1,
      "roomType": "Deluxe",
      "price": 5000.00,
      "amenities": ["AC", "WiFi", "Attached Bathroom"],
      "images": ["/images/room1.jpg"],
      "occupiedBeds": 2,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Get Room by ID
Retrieve a specific room by its ID.

**Endpoint:** `GET /api/rooms/{id}`

**Parameters:**
- `id` (path, required): Room UUID

**Authorization:** Required (All authenticated users)

**Response:**
```json
{
  "success": true,
  "message": "Room retrieved successfully",
  "data": {
    "id": "uuid",
    "pgId": "uuid",
    "roomNumber": "101",
    "capacity": 4,
    "isAvailable": true,
    "description": "Spacious room with balcony",
    "floorNumber": 1,
    "roomType": "Deluxe",
    "price": 5000.00,
    "amenities": ["AC", "WiFi", "Attached Bathroom"],
    "images": ["/images/room1.jpg"],
    "occupiedBeds": 2,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 3. Get Rooms by PG ID
Retrieve all rooms for a specific PG.

**Endpoint:** `GET /api/rooms/pg/{pgId}`

**Parameters:**
- `pgId` (path, required): PG UUID

**Authorization:** Required (All authenticated users)

**Response:**
```json
{
  "success": true,
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "pgId": "uuid",
      "roomNumber": "101",
      "capacity": 4,
      "isAvailable": true,
      "description": "Spacious room with balcony",
      "floorNumber": 1,
      "roomType": "Deluxe",
      "price": 5000.00,
      "amenities": ["AC", "WiFi", "Attached Bathroom"],
      "images": ["/images/room1.jpg"],
      "occupiedBeds": 2,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 4. Create Room
Create a new room.

**Endpoint:** `POST /api/rooms`

**Authorization:** Required (SuperAdmin, PGAdmin, Staff)

**Request Body:**
```json
{
  "pgId": "uuid",
  "roomNumber": "101",
  "capacity": 4,
  "description": "Spacious room with balcony",
  "floorNumber": 1,
  "roomType": "Deluxe",
  "price": 5000.00,
  "amenities": ["AC", "WiFi", "Attached Bathroom"],
  "images": ["/images/room1.jpg"]
}
```

**Required Fields:**
- `pgId`: UUID of the PG
- `roomNumber`: Room number/identifier (string)
- `capacity`: Number of beds (integer, min: 1)

**Optional Fields:**
- `description`: Room description (string)
- `floorNumber`: Floor number (integer)
- `roomType`: Type of room - "Standard", "Deluxe", "Premium", "Suite" (string, default: "Standard")
- `price`: Monthly rent price (decimal)
- `amenities`: Array of amenities (array of strings)
- `images`: Array of image URLs (array of strings)

**Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": "uuid",
    "pgId": "uuid",
    "roomNumber": "101",
    "capacity": 4,
    "isAvailable": true,
    "description": "Spacious room with balcony",
    "floorNumber": 1,
    "roomType": "Deluxe",
    "price": 5000.00,
    "amenities": ["AC", "WiFi", "Attached Bathroom"],
    "images": ["/images/room1.jpg"],
    "occupiedBeds": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5. Update Room
Update an existing room.

**Endpoint:** `PUT /api/rooms/{id}`

**Parameters:**
- `id` (path, required): Room UUID

**Authorization:** Required (SuperAdmin, PGAdmin, Staff)

**Request Body:**
```json
{
  "roomNumber": "101",
  "capacity": 4,
  "isAvailable": true,
  "description": "Updated description",
  "floorNumber": 1,
  "roomType": "Premium",
  "price": 6000.00,
  "amenities": ["AC", "WiFi", "Attached Bathroom", "TV"],
  "images": ["/images/room1.jpg", "/images/room1-2.jpg"]
}
```

**All fields are optional** - only include fields you want to update.

**Response:**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    "id": "uuid",
    "pgId": "uuid",
    "roomNumber": "101",
    "capacity": 4,
    "isAvailable": true,
    "description": "Updated description",
    "floorNumber": 1,
    "roomType": "Premium",
    "price": 6000.00,
    "amenities": ["AC", "WiFi", "Attached Bathroom", "TV"],
    "images": ["/images/room1.jpg", "/images/room1-2.jpg"],
    "occupiedBeds": 2,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 6. Delete Room
Soft delete a room (marks as deleted, doesn't remove from database).

**Endpoint:** `DELETE /api/rooms/{id}`

**Parameters:**
- `id` (path, required): Room UUID

**Authorization:** Required (SuperAdmin, PGAdmin)

**Response:**
```json
{
  "success": true,
  "message": "Room deleted successfully",
  "data": true
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Room not found",
  "data": null
}
```

---

## Data Models

### RoomDto
```typescript
{
  id: UUID;
  pgId: UUID;
  roomNumber: string;
  capacity: number;
  isAvailable: boolean;
  description?: string;
  floorNumber?: number;
  roomType: string; // "Standard" | "Deluxe" | "Premium" | "Suite"
  price?: number;
  amenities: string[];
  images: string[];
  occupiedBeds: number;
  createdAt: DateTime;
}
```

### CreateRoomRequest
```typescript
{
  pgId: UUID;
  roomNumber: string;
  capacity: number;
  description?: string;
  floorNumber?: number;
  roomType?: string;
  price?: number;
  amenities?: string[];
  images?: string[];
}
```

### UpdateRoomRequest
```typescript
{
  roomNumber?: string;
  capacity?: number;
  isAvailable?: boolean;
  description?: string;
  floorNumber?: number;
  roomType?: string;
  price?: number;
  amenities?: string[];
  images?: string[];
}
```

---

## Frontend API Usage

### JavaScript/React Example

```javascript
import { roomApi } from "server/api";

// Get all rooms
const allRooms = await roomApi.getAll();

// Get rooms by PG ID
const rooms = await roomApi.getByPgId(pgId);

// Get room by ID
const room = await roomApi.getById(roomId);

// Create room
const newRoom = await roomApi.create({
  pgId: "uuid",
  roomNumber: "101",
  capacity: 4,
  roomType: "Deluxe",
  price: 5000,
  description: "Spacious room",
  floorNumber: 1,
  amenities: ["AC", "WiFi"],
  images: ["/images/room1.jpg"]
});

// Update room
const updatedRoom = await roomApi.update(roomId, {
  price: 6000,
  description: "Updated description"
});

// Delete room
await roomApi.delete(roomId);
```

---

## Notes

1. **Soft Delete**: Rooms are soft-deleted (marked as deleted) rather than permanently removed from the database.

2. **Occupied Beds**: The `occupiedBeds` field should be updated when tenants are assigned to beds in the room. This is typically handled by the bed/tenant assignment logic.

3. **Availability**: The `isAvailable` field can be manually set, but it's recommended to calculate it based on `occupiedBeds < capacity`.

4. **Room Types**: Supported room types are:
   - Standard
   - Deluxe
   - Premium
   - Suite

5. **Images**: Image URLs should be relative paths or full URLs to the room images.

6. **Amenities**: Amenities are stored as an array of strings. Common amenities include:
   - AC
   - WiFi
   - Attached Bathroom
   - TV
   - Refrigerator
   - Geyser
   - etc.

