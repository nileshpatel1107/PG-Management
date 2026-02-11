# Sidebar Menu Configuration Guide

## How Sidebar Menu Works

The sidebar uses a two-panel system:
1. **MainPanel** - Shows root navigation items (Dashboards, User Management, etc.)
2. **PrimePanel** - Shows child items when a root item is selected

## Navigation Structure

Navigation items are defined in `/app/navigation/` folder:

### File Structure
```
/app/navigation/
  ├── index.js          # Main export - combines all navigation
  ├── dashboards.js     # Dashboards navigation
  └── users.js          # User Management navigation
```

### Navigation Item Structure

Each navigation item can be:
- **NAV_TYPE_ROOT** - Root menu item (shows in MainPanel, opens PrimePanel)
- **NAV_TYPE_ITEM** - Direct link item (shows in PrimePanel)
- **NAV_TYPE_COLLAPSE** - Collapsible group
- **NAV_TYPE_DIVIDER** - Visual divider

### Example: User Management Navigation

```javascript
// app/navigation/users.js
import { UsersIcon } from '@heroicons/react/24/outline';
import TableIcon from 'assets/dualicons/table.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_USERS = '/users'

const path = (root, item) => `${root}${item}`;

export const users = {
    id: 'users',                    // Unique ID for filtering
    type: NAV_TYPE_ROOT,            // Root menu item
    path: '/users',                 // Base path
    title: 'User Management',       // Display title
    transKey: 'nav.users.users',    // Translation key
    Icon: TableIcon,                // Icon component
    childs: [                       // Child items (shown in PrimePanel)
        {
            id: 'users.list',
            path: path(ROOT_USERS, ''),
            type: NAV_TYPE_ITEM,
            title: 'All Users',
            transKey: 'nav.users.list',
            Icon: UsersIcon,
        },
    ]
}
```

## Adding to Navigation

1. **Create navigation file** (e.g., `app/navigation/users.js`)
2. **Export the navigation object** with proper structure
3. **Import in `app/navigation/index.js`**
4. **Add to navigation array**

```javascript
// app/navigation/index.js
import { dashboards } from "./dashboards";
import { users } from "./users";

export const navigation = [
    dashboards,
    users,  // Add your new navigation here
]
```

## Role-Based Filtering

The menu is filtered in:
- `app/layouts/MainLayout/Sidebar/MainPanel/Menu/index.jsx`
- `app/layouts/MainLayout/Sidebar/PrimePanel/Menu/index.jsx`

### Filtering Logic

```javascript
const filteredNav = useMemo(() => {
  return nav.filter((item) => {
    if (item.id === "users") {
      const userRole = user?.role || user?.Role || user?.userRole || user?.UserRole;
      
      // Handle both string and number formats
      const isSuperAdmin = 
        userRole === "SuperAdmin" || userRole === 1 || userRole === "1";
      const isPGAdmin = 
        userRole === "PGAdmin" || userRole === 2 || userRole === "2";
      
      return isSuperAdmin || isPGAdmin;
    }
    return true;
  });
}, [nav, user]);
```

## Debugging Menu Not Showing

1. **Check user role**: Console log `user` object to see role format
2. **Check navigation**: Verify navigation is imported correctly
3. **Check filtering**: Temporarily remove filter to test
4. **Check route**: Ensure route is defined in `protected.jsx`







