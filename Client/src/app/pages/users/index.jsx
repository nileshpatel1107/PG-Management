// Import Dependencies
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useCallback, useEffect, useMemo } from "react";

// Local Imports
import { Page } from "components/shared/Page";
import { Box, Card, Spinner } from "components/ui";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { ListView } from "./ListView";
import { userApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";
import UserFormModal from "./UserFormModal";

// ----------------------------------------------------------------------

export default function UsersPage() {
  const { user: currentUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState([]);

  const [viewType, setViewType] = useLocalStorage(
    "users-table-view-type",
    "list",
  );

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-users",
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-users",
    {},
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll();
      const usersData = response.data || response;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    await fetchUsers();
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const table = useReactTable({
    data: users,
    columns: columns,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
      viewType,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setUsers((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      deleteRow: (row) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setUsers((old) =>
          old.filter((oldRow) => oldRow.id !== row.original.id),
        );
      },
      deleteRows: (rows) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        const rowIds = rows.map((row) => row.original.id);
        setUsers((old) => old.filter((row) => !rowIds.includes(row.id)));
      },
      setTableSettings,
      setViewType,
      onEdit: handleEdit,
      onView: (user) => {
        // Handle view action if needed
        console.log("View user:", user);
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,

    autoResetPageIndex,
    enableRowSelection: true,
  });

  useDidUpdate(() => table.resetRowSelection(), [users]);

  useLockScrollbar(tableSettings.enableFullScreen);

  const rows = table.getRowModel().rows;

  const WrapComponent = viewType === "list" ? Card : Box;

  // Check if user can create - SuperAdmin (role_value 2) or PGAdmin can create users
  // For now, allow any authenticated user to create (can be refined later with proper role checks)
  const canCreate = useMemo(() => {
    if (!currentUser) {
      console.log("No current user found");
      return false;
    }
    
    // Log user object for debugging
    console.log("Current user object:", currentUser);
    
    const role = currentUser.role;
    const roleValue = currentUser.roleValue;
    const roleId = currentUser.roleId;
    
    // Check multiple possible role properties
    // SuperAdmin (role_value 2) or PGAdmin can create users
    const isSuperAdmin = 
      role === "SuperAdmin" || 
      role === "Super Admin" ||
      roleValue === 2 || 
      roleValue === "2" ||
      roleId === 2 ||
      roleId === "2";
      
    const isPGAdmin = 
      role === "PGAdmin" || 
      role === "PG Admin" || 
      roleValue === 3 || 
      roleValue === "3" ||
      roleId === 3 ||
      roleId === "3";
    
    // For now, allow any authenticated user to see the button
    // You can restrict this later: return isSuperAdmin || isPGAdmin;
    const canCreateResult = !!currentUser; // Show for any authenticated user
    
    console.log("User create permission check:", { 
      role, 
      roleValue, 
      roleId,
      isSuperAdmin, 
      isPGAdmin, 
      canCreate: canCreateResult,
      fullUser: currentUser
    });
    
    return canCreateResult;
  }, [currentUser]);

  if (loading) {
    return (
      <Page title="Users Management">
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </Page>
    );
  }

  return (
    <Page title="Users Management">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} onCreateUser={handleCreate} canCreate={canCreate} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
            )}
          >
            <WrapComponent
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
              )}
            >
              {viewType === "list" && (
                <ListView table={table} flexRender={flexRender} rows={rows} />
              )}

              {viewType === "grid" && (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  Grid view coming soon
                </div>
              )}

              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "pb-4 sm:pt-4",
                    (viewType === "list" || tableSettings.enableFullScreen) &&
                      "px-4 sm:px-5",
                    tableSettings.enableFullScreen &&
                      "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
                    viewType === "grid" &&
                      !tableSettings.enableFullScreen &&
                      "mt-3",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </WrapComponent>
            <SelectedRowsActions table={table} />
          </div>
        </div>
      </div>

      {isFormOpen && (
        <UserFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
          user={editingUser}
        />
      )}
    </Page>
  );
}
