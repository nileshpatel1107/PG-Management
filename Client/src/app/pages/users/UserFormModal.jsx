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
import { useState, Fragment, useRef, useEffect, useMemo } from "react";

// Local Imports
import { Button, Input, Select, Checkbox, GhostSpinner } from "components/ui";
import { userApi, roleApi } from "server/api";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .when("$isEdit", {
      is: false,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
  roleValue: Yup.number().required("Role is required"),
  isActive: Yup.boolean(),
});

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
}) {
  const { user: currentUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const focusRef = useRef(null);
  const isEdit = !!user;

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await roleApi.getAll();
        // Handle ApiResponse structure: { success, message, data: [...] }
        // or direct array response
        let rolesList = [];
        if (Array.isArray(response)) {
          rolesList = response;
        } else if (response?.data && Array.isArray(response.data)) {
          rolesList = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          rolesList = response.data.data;
        }
        
        console.log("API Response:", response);
        console.log("Fetched roles list:", rolesList);
        console.log("Current user:", currentUser);
        
        // Filter roles based on current user role
        // Role values: SuperAdmin = 1, PGAdmin = 2, Staff = 3, Tenant = 4
        let filteredRoles = [];
        
        const userRole = currentUser?.role;
        const userRoleValue = currentUser?.roleValue;
        
        console.log("User role check:", { userRole, userRoleValue, typeOfRole: typeof userRole });
        
        // Check if user is SuperAdmin (roleValue 1 or role "SuperAdmin")
        // Handle both numeric and string values
        const isSuperAdmin = 
          userRole === "SuperAdmin" || 
          userRole === 1 || 
          userRole === "1" ||
          userRoleValue === 1 || 
          userRoleValue === "1";
        
        // Check if user is PGAdmin (roleValue 2 or role "PGAdmin")
        // Handle both numeric and string values
        const isPGAdmin = 
          userRole === "PGAdmin" || 
          userRole === "PG Admin" ||
          userRole === 2 ||
          userRole === "2" ||
          userRoleValue === 2 || 
          userRoleValue === "2";
        
        console.log("Role checks:", { isSuperAdmin, isPGAdmin });
        
        if (isSuperAdmin) {
          // SuperAdmin (1) can ONLY create: PGAdmin (2) - per backend validation
          filteredRoles = rolesList.filter(role => {
            // Database uses snake_case: role_value, is_active
            const roleValue = role.role_value || role.roleValue;
            const isActive = role.is_active !== undefined ? role.is_active : (role.isActive !== undefined ? role.isActive : true);
            console.log("Filtering role:", { role, roleValue, isActive, roleValueCheck: roleValue === 2 });
            return isActive && roleValue === 2; // Only show PGAdmin role (role_value 2)
          });
        } else if (isPGAdmin) {
          // PGAdmin (2) can create: Staff (3), Tenant (4)
          filteredRoles = rolesList.filter(role => {
            // Database uses snake_case: role_value, is_active
            const roleValue = role.role_value || role.roleValue;
            const isActive = role.is_active !== undefined ? role.is_active : (role.isActive !== undefined ? role.isActive : true);
            return isActive && (roleValue === 3 || roleValue === 4); // Staff and Tenant
          });
        } else {
          filteredRoles = [];
        }
        
        console.log("Filtered roles:", filteredRoles);
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        console.error("Error details:", error.response || error.message);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen, currentUser]);

  // Map roles to dropdown options: value = role_value, label = name
  // Memoize to prevent infinite loops
  const roleOptions = useMemo(() => {
    return roles.map(role => ({
      value: role.role_value || role.roleValue, // Database column: role_value
      label: role.name || role.Name, // Database column: name
    }));
  }, [roles]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email || "",
      password: "",
      roleValue: user?.roleValue || user?.role || roleOptions[0]?.value || "",
      isActive: user?.isActive ?? true,
    },
    context: { isEdit },
  });

  // Update form when roles are loaded (only for new users, not editing)
  useEffect(() => {
    if (roleOptions.length > 0 && !user && !isEdit) {
      reset({
        email: "",
        password: "",
        roleValue: roleOptions[0]?.value || "",
        isActive: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleOptions.length, isEdit]); // Only depend on length and isEdit, not the full array

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Convert roleValue to Role enum name
      // Role enum: SuperAdmin = 1, PGAdmin = 2, Staff = 3, Tenant = 4
      const roleValueMap = {
        1: "SuperAdmin",
        2: "PGAdmin",
        3: "Staff",
        4: "Tenant",
      };
      
      const roleValue = Number(data.roleValue);
      const roleName = roleValueMap[roleValue];
      
      if (!roleName) {
        throw new Error(`Invalid role value: ${roleValue}`);
      }
      
      const userData = {
        email: data.email,
        role: roleName, // Send as enum name string (e.g., "PGAdmin") - ASP.NET Core will parse it
        isActive: data.isActive,
      };

      if (!isEdit && data.password) {
        userData.password = data.password;
      }

      console.log("Sending user data:", userData);

      if (isEdit) {
        await userApi.update(user.id, userData);
      } else {
        await userApi.create(userData);
      }

      onSubmit();
      reset();
    } catch (error) {
      console.error("Failed to save user:", error);
      console.error("Error response:", error?.response?.data);
      
      // Show detailed validation errors if available
      let errorMessage = error?.response?.data?.message || error?.message || "Failed to save user";
      
      if (error?.response?.data?.errors) {
        const validationErrors = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("\n");
        errorMessage = `Validation errors:\n${validationErrors}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing during save
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
                {isEdit ? "Edit User" : "Create User"}
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

            {loadingRoles ? (
              <div className="flex items-center justify-center py-8">
                <GhostSpinner variant="soft" className="size-6 border-2" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="mt-6 space-y-4"
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email")}
                  error={errors?.email?.message}
                  disabled={isEdit || loading}
                />

                {!isEdit && (
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    {...register("password")}
                    error={errors?.password?.message}
                    disabled={loading}
                  />
                )}

                <Select
                  label="Role"
                  data={roleOptions}
                  {...register("roleValue")}
                  error={errors?.roleValue?.message}
                  disabled={
                    (isEdit && currentUser?.role !== "SuperAdmin") || loading || loadingRoles
                  }
                />

                <Checkbox
                  label="Active"
                  type="checkbox"
                  {...register("isActive")}
                  disabled={loading}
                  defaultChecked={user?.isActive ?? true}
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
                    disabled={loading || loadingRoles || roleOptions.length === 0}
                    className="min-w-[7rem] space-x-2"
                  >
                    {loading && (
                      <GhostSpinner variant="soft" className="size-4 border-2" />
                    )}
                    <span>{isEdit ? "Update" : "Create"}</span>
                  </Button>
                </div>
              </form>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
