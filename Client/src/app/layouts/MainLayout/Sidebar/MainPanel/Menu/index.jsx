// Import Dependencies
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useMemo } from "react";

// Local Imports
import { NAV_TYPE_ITEM } from "constants/app.constant";
import { ScrollShadow } from "components/ui";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useAuthContext } from "app/contexts/auth/context";
import { Item } from "./Item";

// ----------------------------------------------------------------------

export function Menu({ nav, setActiveSegment, activeSegment }) {
  const { t } = useTranslation();
  const { isExpanded, open } = useSidebarContext();
  const { user } = useAuthContext();

  // Filter navigation based on user role
  const filteredNav = useMemo(() => {
    // Debug: Log user and navigation for troubleshooting
    console.log('🔍 Sidebar Menu Debug:');
    console.log('  - User object:', user);
    console.log('  - Navigation items:', nav);
    console.log('  - Navigation count:', nav?.length);

    // If user is not loaded yet, show all menus (will re-filter when user loads)
    if (!user) {
      console.log('  ⚠️ User not loaded yet, showing all menus');
      return nav;
    }

    return nav.filter((item) => {
      // Show Users menu only for SuperAdmin and PGAdmin
      if (item.id === "users") {
        // Get user role - handle different property names and formats
        const userRole = user?.role || user?.Role || user?.userRole || user?.UserRole;
        
        console.log('  🔐 Checking Users menu access:');
        console.log('    - User Role:', userRole);
        console.log('    - Role Type:', typeof userRole);
        console.log('    - Full User Object:', JSON.stringify(user, null, 2));
        
        // Handle both string and number formats
        // Role enum: SuperAdmin=1, PGAdmin=2, Staff=3, Tenant=4
        const roleStr = String(userRole).toLowerCase();
        const isSuperAdmin = 
          userRole === "SuperAdmin" || 
          userRole === 1 || 
          userRole === "1" ||
          roleStr === "superadmin" ||
          roleStr === "1";
        const isPGAdmin = 
          userRole === "PGAdmin" || 
          userRole === 2 || 
          userRole === "2" ||
          roleStr === "pgadmin" ||
          roleStr === "2";
        
        const hasAccess = isSuperAdmin || isPGAdmin;
        
        console.log('    - Has Access:', hasAccess);
        console.log('    - Is SuperAdmin:', isSuperAdmin);
        console.log('    - Is PGAdmin:', isPGAdmin);
        
        return hasAccess;
      }
      
      // Show PG menu for SuperAdmin and PGAdmin (can create rooms)
      if (item.id === "pg") {
        const userRole = user?.role || user?.Role || user?.userRole || user?.UserRole;
        const roleStr = String(userRole).toLowerCase();
        const isSuperAdmin = 
          userRole === "SuperAdmin" || userRole === 1 || userRole === "1" ||
          roleStr === "superadmin" || roleStr === "1";
        const isPGAdmin = 
          userRole === "PGAdmin" || userRole === 2 || userRole === "2" ||
          roleStr === "pgadmin" || roleStr === "2";
        return isSuperAdmin || isPGAdmin;
      }
      
      // Show Rooms menu for SuperAdmin and PGAdmin (can create rooms)
      if (item.id === "rooms") {
        const userRole = user?.role || user?.Role || user?.userRole || user?.UserRole;
        const roleStr = String(userRole).toLowerCase();
        const isSuperAdmin = 
          userRole === "SuperAdmin" || userRole === 1 || userRole === "1" ||
          roleStr === "superadmin" || roleStr === "1";
        const isPGAdmin = 
          userRole === "PGAdmin" || userRole === 2 || userRole === "2" ||
          roleStr === "pgadmin" || roleStr === "2";
        return isSuperAdmin || isPGAdmin;
      }
      
      // Show Complaints menu for Tenants (can raise complaints)
      if (item.id === "complaints") {
        const userRole = user?.role || user?.Role || user?.userRole || user?.UserRole;
        const roleStr = String(userRole).toLowerCase();
        const isTenant = 
          userRole === "Tenant" || userRole === 4 || userRole === "4" ||
          roleStr === "tenant" || roleStr === "4";
        // Also show for PGAdmin and Staff (can resolve complaints)
        const isPGAdmin = 
          userRole === "PGAdmin" || userRole === 2 || userRole === "2" ||
          roleStr === "pgadmin" || roleStr === "2";
        const isStaff = 
          userRole === "Staff" || userRole === 3 || userRole === "3" ||
          roleStr === "staff" || roleStr === "3";
        return isTenant || isPGAdmin || isStaff;
      }
      
      // Show all other items (dashboards, settings, etc.)
      return true;
    });
  }, [nav, user]);

  const handleSegmentSelect = (path) => {
    setActiveSegment(path);
    if (!isExpanded) {
      open();
    }
  };

  const getProps = ({ path, type, title, transKey, linkProps }) => {
    const isLink = type === NAV_TYPE_ITEM;

    // Get translation, but if it returns the key itself (no translation found), use title
    const translated = transKey ? t(transKey) : null;
    const displayTitle = (translated && translated !== transKey) ? translated : (title || path);

    return {
      component: isLink ? Link : "button",
      ...(isLink && { to: path, ...linkProps }),
      onClick: !isLink ? () => handleSegmentSelect(path) : null,
      isActive: path === activeSegment,
      title: displayTitle,
      path,
    };
  };

  return (
    <ScrollShadow
      data-root-menu
      className="hide-scrollbar flex w-full grow flex-col items-center space-y-4 overflow-y-auto pt-5 lg:space-y-3 xl:pt-5 2xl:space-y-4"
    >
      {filteredNav.map(({ id, Icon, path, type, title, transKey, linkProps }) => {
        return (
          <Item
            key={path}
            {...getProps({ path, type, title, transKey, linkProps })}
            id={id}
            Icon={Icon}
          />
        );
      })}
    </ScrollShadow>
  );
}

Menu.propTypes = {
  nav: PropTypes.array,
  activeSegment: PropTypes.string,
  setActiveSegment: PropTypes.func,
};
