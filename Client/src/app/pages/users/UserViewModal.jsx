// Import Dependencies
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef } from "react";

// Local Imports
import { Button, Badge } from "components/ui";

// ----------------------------------------------------------------------

export default function UserViewModal({ isOpen, onClose, user }) {
  const focusRef = useRef(null);

  if (!user) return null;

  // Map role values to labels and colors
  const ROLE_VALUE_MAP = {
    1: { label: "Super Admin", color: "primary" },
    2: { label: "PG Admin", color: "info" },
    3: { label: "Staff", color: "success" },
    4: { label: "Tenant", color: "warning" },
  };

  const roleName = user.roleName || user.role;
  const roleValue = user.roleValue || user.role_value;
  const roleInfo = ROLE_VALUE_MAP[roleValue] || { label: roleName || "Unknown", color: "neutral" };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        initialFocus={focusRef}
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="scrollbar-sm relative flex w-full max-w-lg flex-col overflow-y-auto rounded-lg bg-white px-4 py-6 transition-opacity duration-300 dark:bg-dark-700 sm:px-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-dark-600">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold text-gray-800 dark:text-dark-100"
              >
                User Details
              </DialogTitle>
              <Button
                variant="flat"
                isIcon
                onClick={onClose}
                className="size-6 rounded-full"
                ref={focusRef}
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-dark-100">
                  {user.email || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-dark-100">
                  {user.name || user.email || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                  Role
                </label>
                <div className="mt-1">
                  <Badge color={roleInfo.color} variant="outlined">
                    {roleInfo.label}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    color={user.isActive ? "success" : "error"}
                    variant="outlined"
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {user.pgId && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                    PG ID
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-dark-100">
                    {user.pgId}
                  </p>
                </div>
              )}

              {user.createdAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                    Created At
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-dark-100">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              )}

              {user.updatedAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-dark-300">
                    Updated At
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-dark-100">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4 dark:border-dark-600">
              <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                className="min-w-[7rem]"
              >
                Close
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

