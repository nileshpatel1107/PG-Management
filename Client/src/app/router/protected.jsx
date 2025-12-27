// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
          ],
        },
        {
          path: "users",
          lazy: async () => ({
            Component: (await import("app/pages/users")).default,
          }),
        },
        {
          path: "pg",
          lazy: async () => ({
            Component: (await import("app/pages/pg")).default,
          }),
        },
        {
          path: "rooms",
          lazy: async () => ({
            Component: (await import("app/pages/rooms")).default,
          }),
        },
        {
          path: "complaints",
          children: [
            {
              path: "my",
              lazy: async () => ({
                Component: (await import("app/pages/complaints")).default,
              }),
            },
          ],
        },
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
