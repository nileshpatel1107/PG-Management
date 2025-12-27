// Import Dependencies
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Badge, Swap, SwapOff, SwapOn } from "components/ui";
import { StyledSwitch } from "components/shared/form/StyledSwitch";
import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";
import { userApi } from "server/api";

// ----------------------------------------------------------------------

// Map role values to labels and colors
const ROLE_VALUE_MAP = {
  1: { label: "Super Admin", color: "primary" },
  2: { label: "Super Admin", color: "primary" },
  3: { label: "PG Admin", color: "info" },
  4: { label: "Staff", color: "success" },
  5: { label: "Tenant", color: "warning" },
};

const ROLE_LABELS = {
  SuperAdmin: "Super Admin",
  "Super Admin": "Super Admin",
  PGAdmin: "PG Admin",
  "PG Admin": "PG Admin",
  Staff: "Staff",
  Tenant: "Tenant",
  1: "Super Admin",
  2: "Super Admin",
  3: "PG Admin",
  4: "Staff",
  5: "Tenant",
};

const ROLE_COLORS = {
  SuperAdmin: "primary",
  "Super Admin": "primary",
  PGAdmin: "info",
  "PG Admin": "info",
  Staff: "success",
  Tenant: "warning",
  1: "primary",
  2: "primary",
  3: "info",
  4: "success",
  5: "warning",
};

export function NameCell({ row, getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const user = row.original;

  return (
    <div className="flex items-center space-x-3 ltr:-ml-1 rtl:-mr-1 ">
      <Swap
        effect="flip"
        disabled={!row.getCanSelect()}
        onChange={(val) => row.toggleSelected(val === "on")}
        value={row.getIsSelected() ? "on" : "off"}
      >
        <SwapOn className="flex size-10 items-center justify-center p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-500">
            <CheckIcon className="size-5 text-white" />
          </div>
        </SwapOn>
        <SwapOff>
          <Avatar
            size={10}
            classNames={{
              root: "rounded-full border-2 border-dashed border-transparent p-0.5 transition-colors group-hover/tr:border-gray-400 dark:group-hover/tr:border-dark-300",
              display: "text-xs-plus",
            }}
            src={user.avatar}
            initialColor="auto"
            name={user.email || user.name || "User"}
          />
        </SwapOff>
      </Swap>

      <div className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>
          {getValue() || user.email || "Unknown"}
        </Highlight>
      </div>
    </div>
  );
}

export function RoleCell({ getValue, row }) {
  const val = getValue();
  const user = row?.original;
  
  // Try to get role name from user object first, then fallback to value
  const roleName = user?.roleName || user?.role || val;
  const roleValue = user?.roleValue || user?.roleValue || val;
  
  // Map role value to label and color
  let roleLabel = ROLE_LABELS[roleName] || ROLE_LABELS[roleValue] || ROLE_VALUE_MAP[roleValue]?.label;
  let roleColor = ROLE_COLORS[roleName] || ROLE_COLORS[roleValue] || ROLE_VALUE_MAP[roleValue]?.color;
  
  // If still no match, try to convert number to string
  if (!roleLabel && typeof val === 'number') {
    roleLabel = ROLE_VALUE_MAP[val]?.label || `Role ${val}`;
    roleColor = ROLE_VALUE_MAP[val]?.color || "neutral";
  } else if (!roleLabel) {
    roleLabel = String(val || "Unknown");
    roleColor = "neutral";
  }

  return (
    <Badge color={roleColor || "neutral"} variant="outlined">
      {roleLabel}
    </Badge>
  );
}

export function StatusCell({
  getValue,
  row: { index, original },
  column: { id },
  table,
}) {
  const val = getValue();
  const [loading, setLoading] = useState(false);

  const onChange = async (checked) => {
    setLoading(true);
    try {
      await userApi.update(original.id, { isActive: checked });
      table.options.meta?.updateData(index, id, checked);
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSwitch
      className="mx-auto"
      checked={val}
      onChange={onChange}
      loading={loading}
    />
  );
}

NameCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};

RoleCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};


