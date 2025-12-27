// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { CopyableCell } from "components/shared/table/CopyableCell";
import { NameCell, RoleCell, StatusCell } from "./rows";
import { RowActions } from "./RowActions";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.isActive, {
    id: "status",
    header: "Stat",
    label: "Status",
    cell: StatusCell,
  }),
  columnHelper.accessor((row) => row.email || row.name || "Unknown", {
    id: "name",
    header: "Name",
    label: "Name",
    cell: NameCell,
  }),
  columnHelper.accessor((row) => row.roleName || row.role || row.roleValue, {
    id: "role",
    header: "Role",
    label: "Role",
    cell: RoleCell,
    filterFn: "equalsString",
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "Email",
    label: "Email",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: "createdAt",
    header: "Created",
    label: "Created",
    cell: (info) => {
      const date = info.getValue();
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    label: "Row Actions",
    cell: RowActions,
  }),
];

