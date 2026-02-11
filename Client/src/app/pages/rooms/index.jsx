// Import Dependencies
import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  Squares2X2Icon,
  TableCellsIcon 
} from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Spinner,
  Box,
  Skeleton
} from "components/ui";
import { roomApi, pgApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";
import { ConfirmModal } from "components/shared/ConfirmModal";
import RoomFormModal from "./RoomFormModal";
import { RoomCard } from "./RoomCard";

// ----------------------------------------------------------------------

export default function RoomsPage() {
  const { user: currentUser } = useAuthContext();
  const [rooms, setRooms] = useState([]);
  const [pgs, setPGs] = useState([]);
  const [selectedPGId, setSelectedPGId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPGs, setLoadingPGs] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoomType, setFilterRoomType] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const fetchPGs = useCallback(async () => {
    try {
      setLoadingPGs(true);
      const response = await pgApi.getAll();
      const pgsData = response.data || response;
      setPGs(Array.isArray(pgsData) ? pgsData : []);
      if (pgsData.length > 0 && !selectedPGId) {
        setSelectedPGId(pgsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch PGs:", error);
      setPGs([]);
    } finally {
      setLoadingPGs(false);
    }
  }, [selectedPGId]);

  const fetchRooms = useCallback(async () => {
    if (!selectedPGId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await roomApi.getByPgId(selectedPGId);
      const roomsData = response.data || response;
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPGId]);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteRoom) return;

    try {
      await roomApi.delete(deleteRoom.id);
      await fetchRooms();
      setDeleteRoom(null);
    } catch (error) {
      console.error("Failed to delete room:", error);
      alert(error?.message || "Failed to delete room");
    }
  };

  const handleFormSubmit = async () => {
    await fetchRooms();
    setIsFormOpen(false);
    setEditingRoom(null);
  };

  // Filter and search rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search filter
      const matchesSearch = 
        !searchQuery ||
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.roomType && room.roomType.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "available" && room.occupiedBeds < room.capacity) ||
        (filterStatus === "full" && room.occupiedBeds >= room.capacity);

      // Room type filter
      const matchesRoomType = 
        filterRoomType === "all" ||
        room.roomType === filterRoomType;

      return matchesSearch && matchesStatus && matchesRoomType;
    });
  }, [rooms, searchQuery, filterStatus, filterRoomType]);

  // Get unique room types for filter
  const roomTypes = useMemo(() => {
    const types = [...new Set(rooms.map(r => r.roomType).filter(Boolean))];
    return types;
  }, [rooms]);

  // Statistics
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter(r => r.occupiedBeds < r.capacity).length;
    const full = rooms.filter(r => r.occupiedBeds >= r.capacity).length;
    const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
    const totalOccupied = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    
    return { total, available, full, totalCapacity, totalOccupied };
  }, [rooms]);

  const canCreate = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";
  const canEdit = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";
  const canDelete = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";

  const pgOptions = pgs.map(pg => ({ value: pg.id, label: pg.name }));

  return (
    <Page title="Room Management">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
                Room Management
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-dark-300">
                Manage and assign rooms to tenants
              </p>
            </div>
            {canCreate && (
              <Button onClick={handleCreate} color="primary">
                <PlusIcon className="size-4" />
                <span>Create Room</span>
              </Button>
            )}
          </div>

          {/* Statistics Cards */}
          {rooms.length > 0 && (
            <Box className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              <Card className="p-4">
                <Box className="text-sm text-gray-600 dark:text-dark-300">Total Rooms</Box>
                <Box className="mt-1 text-2xl font-semibold text-gray-800 dark:text-dark-100">
                  {stats.total}
                </Box>
              </Card>
              <Card className="p-4">
                <Box className="text-sm text-gray-600 dark:text-dark-300">Available</Box>
                <Box className="mt-1 text-2xl font-semibold text-success-600 dark:text-success-400">
                  {stats.available}
                </Box>
              </Card>
              <Card className="p-4">
                <Box className="text-sm text-gray-600 dark:text-dark-300">Full</Box>
                <Box className="mt-1 text-2xl font-semibold text-error-600 dark:text-error-400">
                  {stats.full}
                </Box>
              </Card>
              <Card className="p-4">
                <Box className="text-sm text-gray-600 dark:text-dark-300">Total Beds</Box>
                <Box className="mt-1 text-2xl font-semibold text-gray-800 dark:text-dark-100">
                  {stats.totalCapacity}
                </Box>
              </Card>
              <Card className="p-4">
                <Box className="text-sm text-gray-600 dark:text-dark-300">Occupied</Box>
                <Box className="mt-1 text-2xl font-semibold text-primary-600 dark:text-primary-400">
                  {stats.totalOccupied}
                </Box>
              </Card>
            </Box>
          )}

          {/* Filters and Search */}
          {pgs.length > 0 && (
            <Card className="p-4">
              <div className="space-y-4">
                {/* PG Selector */}
                <div className="w-full max-w-xs">
                  <Select
                    label="Select PG"
                    data={pgOptions}
                    value={selectedPGId}
                    onChange={(e) => setSelectedPGId(e.target.value)}
                  />
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Search */}
                  <div className="flex-1">
                    <Input
                      placeholder="Search rooms by number, type, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="size-5" />}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-48">
                    <Select
                      label="Status"
                      data={[
                        { value: "all", label: "All Status" },
                        { value: "available", label: "Available" },
                        { value: "full", label: "Full" },
                      ]}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    />
                  </div>

                  {/* Room Type Filter */}
                  {roomTypes.length > 0 && (
                    <div className="w-full sm:w-48">
                      <Select
                        label="Room Type"
                        data={[
                          { value: "all", label: "All Types" },
                          ...roomTypes.map(type => ({ value: type, label: type })),
                        ]}
                        value={filterRoomType}
                        onChange={(e) => setFilterRoomType(e.target.value)}
                      />
                    </div>
                  )}

                  {/* View Mode Toggle */}
                  <div className="flex items-end gap-2">
                    <Button
                      variant={viewMode === "grid" ? "filled" : "outlined"}
                      isIcon
                      onClick={() => setViewMode("grid")}
                      className="size-10"
                    >
                      <Squares2X2Icon className="size-5" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "filled" : "outlined"}
                      isIcon
                      onClick={() => setViewMode("list")}
                      className="size-10"
                    >
                      <TableCellsIcon className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Rooms Grid/List */}
          {loadingPGs ? (
            <Box className="flex items-center justify-center py-12">
              <Spinner />
            </Box>
          ) : loading ? (
            <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <Box className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-2 w-full" />
                  </Box>
                </Card>
              ))}
            </Box>
          ) : filteredRooms.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 dark:text-dark-300">
                {selectedPGId 
                  ? searchQuery || filterStatus !== "all" || filterRoomType !== "all"
                    ? "No rooms match your filters"
                    : "No rooms found. Create your first room to get started."
                  : "Please select a PG to view rooms"
                }
              </p>
            </Card>
          ) : (
            <Box
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              }
            >
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={handleEdit}
                  onDelete={setDeleteRoom}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))}
            </Box>
          )}
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <RoomFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRoom(null);
          }}
          onSubmit={handleFormSubmit}
          room={editingRoom}
          pgId={selectedPGId}
        />
      )}

      {deleteRoom && (
        <ConfirmModal
          show={!!deleteRoom}
          onClose={() => setDeleteRoom(null)}
          onOk={handleDelete}
          state="pending"
          messages={{
            pending: {
              title: "Delete Room",
              description: `Are you sure you want to delete room ${deleteRoom.roomNumber}? This action cannot be undone.`,
              actionText: "Delete",
            },
          }}
        />
      )}
    </Page>
  );
}
