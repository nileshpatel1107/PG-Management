// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { userApi } from "server/api";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    title: "Delete User",
    description:
      "Are you sure you want to delete this user? Once deleted, it cannot be restored.",
    actionText: "Delete",
  },
  success: {
    title: "User Deleted",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const user = row.original;

  const closeModal = () => {
    setDeleteModalOpen(false);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    try {
      await userApi.delete(user.id);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      // Refresh the user list after successful deletion
      if (table.options.meta?.refreshData) {
        table.options.meta.refreshData();
      }
      // Close modal after a short delay to show success state
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteError(true);
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, user, table]);

  const handleEdit = () => {
    if (table.options.meta?.onEdit) {
      table.options.meta.onEdit(user);
    }
  };

  const handleView = () => {
    if (table.options.meta?.onView) {
      table.options.meta.onView(user);
    }
  };

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            as={Button}
            variant="flat"
            isIcon
            className="size-7 rounded-full"
          >
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={MenuItems}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleView}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>View</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleEdit}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <PencilIcon className="size-4.5 stroke-1" />
                  <span>Edit</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={openModal}
                  className={clsx(
                    "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                    focus && "bg-this/10 dark:bg-this-light/10",
                  )}
                >
                  <TrashIcon className="size-4.5 stroke-1" />
                  <span>Delete</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};





