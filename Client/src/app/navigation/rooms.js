import { HomeIcon } from '@heroicons/react/24/outline';
import ComponentsIcon from 'assets/dualicons/components.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_ROOMS = '/rooms'

const path = (root, item) => `${root}${item}`;

export const rooms = {
    id: 'rooms',
    type: NAV_TYPE_ROOT,
    path: '/rooms',
    title: 'Room Management',
    transKey: 'nav.rooms.rooms',
    Icon: ComponentsIcon,
    childs: [
        {
            id: 'rooms.list',
            path: path(ROOT_ROOMS, ''),
            type: NAV_TYPE_ITEM,
            title: 'All Rooms',
            transKey: 'nav.rooms.list',
            Icon: HomeIcon,
        },
    ]
}






