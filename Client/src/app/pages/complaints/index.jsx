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
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card, Table, THead, TBody, Tr, Th, Td, Badge, Spinner } from "components/ui";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { complaintApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";
import ComplaintFormModal from "./ComplaintFormModal";

// ----------------------------------------------------------------------

const STATUS_LABELS = {
  1: "Pending",
  2: "In Progress",
  3: "Resolved",
  4: "Closed",
};

const STATUS_COLORS = {
  1: "warning",
  2: "info",
  3: "success",
  4: "neutral",
};

export default function ComplaintsPage() {
  const { user: currentUser } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await complaintApi.getMyComplaints();
      const complaintsData = response.data || response;
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    await fetchComplaints();
    setIsFormOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => {
          const desc = info.getValue();
          return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge color={STATUS_COLORS[status] || "neutral"}>
              {STATUS_LABELS[status] || status}
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
    ],
    []
  );

  const table = useReactTable({
    data: complaints,
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

  const canCreate = currentUser?.role === "Tenant" || currentUser?.role === 4;

  return (
    <Page title="Complaints">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              My Complaints
            </h2>
            {canCreate && (
              <Button onClick={handleCreate} color="primary">
                <PlusIcon className="size-4" />
                <span>Raise Complaint</span>
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
                            No complaints found
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
        <ComplaintFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </Page>
  );
}






