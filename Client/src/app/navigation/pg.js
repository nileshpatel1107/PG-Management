import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import ApplicationsIcon from 'assets/dualicons/applications.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_PG = '/pg'

const path = (root, item) => `${root}${item}`;

export const pg = {
    id: 'pg',
    type: NAV_TYPE_ROOT,
    path: '/pg',
    title: 'PG Management',
    transKey: 'nav.pg.pg',
    Icon: ApplicationsIcon,
    childs: [
        {
            id: 'pg.list',
            path: path(ROOT_PG, ''),
            type: NAV_TYPE_ITEM,
            title: 'All PGs',
            transKey: 'nav.pg.list',
            Icon: BuildingOfficeIcon,
        },
    ]
}



