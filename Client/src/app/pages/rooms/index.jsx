// Import Dependencies
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card, Table, THead, TBody, Tr, Th, Td, Badge, Spinner, Select } from "components/ui";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { roomApi, pgApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";
import { ConfirmModal } from "components/shared/ConfirmModal";
import RoomFormModal from "./RoomFormModal";

// ----------------------------------------------------------------------

export default function RoomsPage() {
  const { user: currentUser } = useAuthContext();
  const [rooms, setRooms] = useState([]);
  const [pgs, setPGs] = useState([]);
  const [selectedPGId, setSelectedPGId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);

  const fetchPGs = useCallback(async () => {
    try {
      const response = await pgApi.getAll();
      const pgsData = response.data || response;
      setPGs(Array.isArray(pgsData) ? pgsData : []);
      if (pgsData.length > 0 && !selectedPGId) {
        setSelectedPGId(pgsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch PGs:", error);
    }
  }, [selectedPGId]);

  const fetchRooms = useCallback(async () => {
    if (!selectedPGId) return;
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "roomNumber",
        header: "Room Number",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "isAvailable",
        header: "Status",
        cell: (info) => {
          const isAvailable = info.getValue();
          return (
            <Badge color={isAvailable ? "success" : "error"}>
              {isAvailable ? "Available" : "Occupied"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString();
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const room = info.row.original;
          const canEdit = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";
          const canDelete = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";

          return (
            <div className="flex items-center space-x-2">
              {canEdit && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleEdit(room)}
                  className="h-8 w-8 p-0"
                >
                  <PencilIcon className="size-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteRoom(room)}
                  className="h-8 w-8 p-0"
                >
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [currentUser]
  );

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const canCreate = currentUser?.role === "SuperAdmin" || currentUser?.role === "PGAdmin";

  const pgOptions = pgs.map(pg => ({ value: pg.id, label: pg.name }));

  return (
    <Page title="Room Management">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              Rooms
            </h2>
            {canCreate && (
              <Button onClick={handleCreate} color="primary">
                <PlusIcon className="size-4" />
                <span>Create Room</span>
              </Button>
            )}
          </div>

          {pgs.length > 0 && (
            <div className="w-full max-w-xs">
              <Select
                label="Select PG"
                data={pgOptions}
                value={selectedPGId}
                onChange={(e) => setSelectedPGId(e.target.value)}
              />
            </div>
          )}

          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table hoverable className="w-full">
                    <THead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <Th key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </Th>
                          ))}
                        </Tr>
                      ))}
                    </THead>
                    <TBody>
                      {table.getRowModel().rows.length === 0 ? (
                        <Tr>
                          <Td colSpan={columns.length} className="text-center py-8">
                            {selectedPGId ? "No rooms found" : "Please select a PG"}
                          </Td>
                        </Tr>
                      ) : (
                        table.getRowModel().rows.map((row) => (
                          <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <Td key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            ))}
                          </Tr>
                        ))
                      )}
                    </TBody>
                  </Table>
                </div>
                <div className="border-t border-gray-200 p-4 dark:border-dark-500">
                  <PaginationSection table={table} />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

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






