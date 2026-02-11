// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { GHOST_ENTRY_PATH } from "../constants/app.constant";

// ----------------------------------------------------------------------

/**
 * RoleGuard - Protects routes based on user roles
 * 
 * @param {Object} props
 * @param {string|string[]} props.allowedRoles - Single role or array of allowed roles
 * @param {React.ReactNode} props.fallback - Optional fallback component to render if access denied
 * @returns {React.ReactNode}
 */
export default function RoleGuard({ allowedRoles, fallback = null }) {
  const outlet = useOutlet();
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${GHOST_ENTRY_PATH}?redirect=${location.pathname}`}
        replace
      />
    );
  }

  // Get user role (support different property names)
  const userRole = user?.role || user?.userRole || user?.UserRole;

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has required role
  const hasAccess = rolesArray.includes(userRole);

  if (!hasAccess) {
    // If fallback provided, render it; otherwise redirect to home
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/dashboards/home" replace />;
  }

  return <>{outlet}</>;
}







