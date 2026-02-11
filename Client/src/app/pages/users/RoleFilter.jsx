// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

const roleOptions = [
  { value: "", label: "All" },
  { value: "SuperAdmin", label: "Super Admin" },
  { value: "PGAdmin", label: "PG Admin" },
  { value: "Staff", label: "Staff" },
  { value: "Tenant", label: "Tenant" },
];

export function RoleFilter({ column }) {
  const selectedValue = column?.getFilterValue() || "";

  return (
    <div
      data-tab
      className="flex rounded-md bg-gray-200 px-1 py-1 text-xs-plus text-gray-800 dark:bg-dark-700 dark:text-dark-200"
    >
      {roleOptions.map((option) => (
        <Button
          key={option.value}
          data-tab-item
          onClick={() => column.setFilterValue(option.value === "All" ? "" : option.value)}
          className={clsx(
            "shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium",
            selectedValue === option.value ||
            (option.value === "" && selectedValue === "")
              ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
              : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
          )}
          unstyled
          onKeyDown={createScopedKeydownHandler({
            siblingSelector: "[data-tab-item]",
            parentSelector: "[data-tab]",
            activateOnFocus: true,
            loop: false,
            orientation: "horizontal",
          })}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

RoleFilter.propTypes = {
  column: PropTypes.object,
};





