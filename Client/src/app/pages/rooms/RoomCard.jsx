// Import Dependencies
import { PencilIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

// Local Imports
import { Card, Badge, Tag, Button, Box, Progress } from "components/ui";

// ----------------------------------------------------------------------

export function RoomCard({ room, onEdit, onDelete, canEdit, canDelete }) {
  const availabilityPercentage = room.capacity > 0 
    ? (room.occupiedBeds / room.capacity) * 100 
    : 0;
  const isFullyOccupied = room.occupiedBeds >= room.capacity;

  const roomTypeColors = {
    Standard: "info",
    Deluxe: "warning",
    Premium: "secondary",
    Suite: "success",
  };

  const roomImage = room.images && room.images.length > 0 
    ? room.images[0] 
    : "/images/800x600.png";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Room Image */}
      <Box className="relative h-48 w-full overflow-hidden">
        <img
          src={roomImage}
          alt={room.roomNumber}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            color={isFullyOccupied ? "error" : "success"}
            className="shadow-lg"
          >
            {isFullyOccupied ? "Full" : "Available"}
          </Badge>
        </div>

        {/* Room Type Tag */}
        {room.roomType && (
          <div className="absolute top-3 left-3">
            <Tag
              variant="filled"
              color={roomTypeColors[room.roomType] || "info"}
              className="rounded-full px-3 py-1 text-xs font-medium uppercase shadow-lg"
            >
              {room.roomType}
            </Tag>
          </div>
        )}

        {/* Floor Number */}
        {room.floorNumber && (
          <Box className="absolute bottom-3 left-3">
            <Box className="rounded-lg bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Floor {room.floorNumber}
            </Box>
          </Box>
        )}
      </Box>

      {/* Room Content */}
      <Box className="p-4">
        {/* Room Number and Price */}
        <Box className="mb-3 flex items-start justify-between">
          <Box>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
              Room {room.roomNumber}
            </h3>
            {room.price && (
              <Box className="mt-1 text-sm text-gray-600 dark:text-dark-300">
                <span className="text-base font-semibold text-primary-600 dark:text-primary-400">
                  ₹{room.price.toLocaleString()}
                </span>
                <span className="text-xs">/month</span>
              </Box>
            )}
          </Box>
        </Box>

        {/* Description */}
        {room.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-dark-300">
            {room.description}
          </p>
        )}

        {/* Capacity and Occupancy */}
        <Box className="mb-3 space-y-2">
          <Box className="flex items-center justify-between text-sm">
            <Box className="flex items-center gap-2 text-gray-600 dark:text-dark-300">
              <UserGroupIcon className="size-4" />
              <span>Capacity: {room.capacity} beds</span>
            </Box>
            <span className="font-medium text-gray-800 dark:text-dark-100">
              {room.occupiedBeds}/{room.capacity} occupied
            </span>
          </Box>
          
          {/* Occupancy Progress Bar - Using Theme Progress Component */}
          <Progress
            value={Math.min(availabilityPercentage, 100)}
            color={
              isFullyOccupied 
                ? "error" 
                : availabilityPercentage > 75 
                ? "warning" 
                : "success"
            }
            className="h-2"
          />
        </Box>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <Box className="mb-3 flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Tag
                key={index}
                variant="soft"
                color="info"
                className="text-xs"
              >
                {amenity}
              </Tag>
            ))}
            {room.amenities.length > 3 && (
              <Tag variant="soft" color="neutral" className="text-xs">
                +{room.amenities.length - 3} more
              </Tag>
            )}
          </Box>
        )}

        {/* Actions */}
        {(canEdit || canDelete) && (
          <Box className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-dark-600">
            {canEdit && (
              <Button
                variant="outlined"
                size="sm"
                onClick={() => onEdit(room)}
                className="flex-1"
              >
                <PencilIcon className="size-4" />
                <span>Edit</span>
              </Button>
            )}
            {canDelete && (
              <Button
                variant="outlined"
                color="error"
                size="sm"
                onClick={() => onDelete(room)}
                className="flex-1"
              >
                <TrashIcon className="size-4" />
                <span>Delete</span>
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

