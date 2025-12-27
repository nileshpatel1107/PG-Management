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
import { Button, Card, Table, THead, TBody, Tr, Th, Td, Spinner } from "components/ui";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { pgApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";
import { ConfirmModal } from "components/shared/ConfirmModal";
import PGFormModal from "./PGFormModal";

// ----------------------------------------------------------------------

export default function PGPage() {
  const { user: currentUser } = useAuthContext();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [deletePG, setDeletePG] = useState(null);

  const fetchPGs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pgApi.getAll();
      const pgsData = response.data || response;
      setPGs(Array.isArray(pgsData) ? pgsData : []);
    } catch (error) {
      console.error("Failed to fetch PGs:", error);
      setPGs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  const handleCreate = () => {
    setEditingPG(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pg) => {
    setEditingPG(pg);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletePG) return;

    try {
      await pgApi.delete(deletePG.id);
      await fetchPGs();
      setDeletePG(null);
    } catch (error) {
      console.error("Failed to delete PG:", error);
      alert(error?.message || "Failed to delete PG");
    }
  };

  const handleFormSubmit = async () => {
    await fetchPGs();
    setIsFormOpen(false);
    setEditingPG(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "ownerId",
        header: "Owner ID",
        cell: (info) => info.getValue(),
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
          const pg = info.row.original;
          const canEdit = currentUser?.role === "SuperAdmin" || 
                         (currentUser?.role === "PGAdmin" && pg.ownerId === currentUser.id);
          const canDelete = currentUser?.role === "SuperAdmin";

          return (
            <div className="flex items-center space-x-2">
              {canEdit && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleEdit(pg)}
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
                  onClick={() => setDeletePG(pg)}
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
    data: pgs,
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

  return (
    <Page title="PG Management">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              Paying Guest Properties
            </h2>
            {canCreate && (
              <Button onClick={handleCreate} color="primary">
                <PlusIcon className="size-4" />
                <span>Create PG</span>
              </Button>
            )}
          </div>

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
                            No PGs found
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
        <PGFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPG(null);
          }}
          onSubmit={handleFormSubmit}
          pg={editingPG}
        />
      )}

      {deletePG && (
        <ConfirmModal
          show={!!deletePG}
          onClose={() => setDeletePG(null)}
          onOk={handleDelete}
          state="pending"
          messages={{
            pending: {
              title: "Delete PG",
              description: `Are you sure you want to delete PG ${deletePG.name}? This action cannot be undone.`,
              actionText: "Delete",
            },
          }}
        />
      )}
    </Page>
  );
}



