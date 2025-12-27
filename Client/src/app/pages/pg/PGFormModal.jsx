// Import Dependencies
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, Fragment, useRef } from "react";

// Local Imports
import { Button, Input, GhostSpinner } from "components/ui";
import { pgApi } from "server/api";

// ----------------------------------------------------------------------

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
});

export default function PGFormModal({
  isOpen,
  onClose,
  onSubmit,
  pg,
}) {
  const [loading, setLoading] = useState(false);
  const focusRef = useRef(null);
  const isEdit = !!pg;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: pg?.name || "",
      address: pg?.address || "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const pgData = {
        name: data.name,
        address: data.address,
      };

      if (isEdit) {
        await pgApi.update(pg.id, pgData);
      } else {
        await pgApi.create(pgData);
      }

      onSubmit();
      reset();
    } catch (error) {
      console.error("Failed to save PG:", error);
      alert(error?.message || "Failed to save PG");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const dialogProps = loading
    ? {
        onClose: () => {},
        static: true,
      }
    : {
        onClose: handleClose,
      };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        initialFocus={focusRef}
        {...dialogProps}
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
                {isEdit ? "Edit PG" : "Create PG"}
              </DialogTitle>
              <Button
                variant="flat"
                isIcon
                onClick={handleClose}
                disabled={loading}
                className="size-6 rounded-full"
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="mt-6 space-y-4"
            >
              <Input
                label="Name"
                placeholder="Enter PG name"
                {...register("name")}
                error={errors?.name?.message}
                disabled={loading}
              />

              <Input
                label="Address"
                placeholder="Enter PG address"
                {...register("address")}
                error={errors?.address?.message}
                disabled={loading}
              />

              <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-dark-600">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                  className="min-w-[7rem]"
                >
                  Cancel
                </Button>
                <Button
                  ref={focusRef}
                  type="submit"
                  color="primary"
                  disabled={loading}
                  className="min-w-[7rem] space-x-2"
                >
                  {loading && (
                    <GhostSpinner variant="soft" className="size-4 border-2" />
                  )}
                  <span>{isEdit ? "Update" : "Create"}</span>
                </Button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}






