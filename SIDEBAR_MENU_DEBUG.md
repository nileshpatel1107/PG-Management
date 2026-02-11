# Sidebar Menu Debug Guide

## Current Configuration

### 1. Navigation Definition
**File:** `Client/src/app/navigation/users.js`
```javascript
export const users = {
    id: 'users',                    // ✅ Must match filter check
    type: NAV_TYPE_ROOT,            // ✅ Root menu item
    path: '/users',                 // ✅ Base path
    title: 'User Management',       // ✅ Display title
    Icon: TableIcon,                // ✅ Icon component
    childs: [                       // ✅ Child items
        {
            id: 'users.list',
            path: '/users',
            type: NAV_TYPE_ITEM,
            title: 'All Users',
            Icon: UsersIcon,
        },
    ]
}
```

### 2. Navigation Export
**File:** `Client/src/app/navigation/index.js`
```javascript
import { users } from "./users";

export const navigation = [
    dashboards,
    users,  // ✅ Added to navigation array
]
```

### 3. Route Configuration
**File:** `Client/src/app/router/protected.jsx`
```javascript
{
  path: "users",
  lazy: async () => ({
    Component: (await import("app/pages/users")).default,
  }),
}
```

### 4. Role Filtering
**File:** `Client/src/app/layouts/MainLayout/Sidebar/MainPanel/Menu/index.jsx`

The menu filters based on user role. Check browser console for debug logs.

## Debugging Steps

1. **Open Browser Console** (F12)
2. **Look for debug logs:**
   - "Sidebar Menu - User:" - Shows user object
   - "Sidebar Menu - Navigation:" - Shows navigation array
   - "Checking Users menu access" - Shows role check

3. **Check User Role Format:**
   - If role is number: `1` (SuperAdmin), `2` (PGAdmin)
   - If role is string: `"SuperAdmin"`, `"PGAdmin"`
   - Check `user.role`, `user.Role`, `user.userRole`, `user.UserRole`

4. **Temporary Test - Show Menu for All Users:**
   Temporarily comment out the filter to test if menu structure works:

```javascript
const filteredNav = useMemo(() => {
  // TEMPORARY: Show all menus for testing
  return nav;
  
  // ORIGINAL FILTER (uncomment after testing):
  // return nav.filter((item) => {
  //   if (item.id === "users") {
  //     const userRole = user?.role || user?.Role;
  //     const isSuperAdmin = userRole === "SuperAdmin" || userRole === 1;
  //     const isPGAdmin = userRole === "PGAdmin" || userRole === 2;
  //     return isSuperAdmin || isPGAdmin;
  //   }
  //   return true;
  // });
}, [nav, user]);
```

## Common Issues

1. **Menu not showing:**
   - Check if user object is loaded: `console.log(user)`
   - Check if navigation includes users: `console.log(nav)`
   - Verify role value matches filter

2. **Role format mismatch:**
   - Backend sends Role as enum (number or string)
   - Check actual format in console logs
   - Update filter to match actual format

3. **Navigation not imported:**
   - Verify `users` is imported in `navigation/index.js`
   - Verify `users` is in navigation array
   - Check for import errors in console







