import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AlarmIcon from 'assets/dualicons/alarm.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_COMPLAINTS = '/complaints'

const path = (root, item) => `${root}${item}`;

export const complaints = {
    id: 'complaints',
    type: NAV_TYPE_ROOT,
    path: '/complaints',
    title: 'Complaints',
    transKey: 'nav.complaints.complaints',
    Icon: AlarmIcon,
    childs: [
        {
            id: 'complaints.my',
            path: path(ROOT_COMPLAINTS, '/my'),
            type: NAV_TYPE_ITEM,
            title: 'My Complaints',
            transKey: 'nav.complaints.my',
            Icon: ExclamationTriangleIcon,
        },
    ]
}






