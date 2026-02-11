import { UsersIcon } from '@heroicons/react/24/outline';
import TableIcon from 'assets/dualicons/table.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_USERS = '/users'

const path = (root, item) => `${root}${item}`;

export const users = {
    id: 'users',
    type: NAV_TYPE_ROOT,
    path: '/users',
    title: 'User Management',
    transKey: 'nav.users.users',
    Icon: TableIcon,
    childs: [
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







