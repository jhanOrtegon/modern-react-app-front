import { lazy } from 'react'

import type { RouteObject } from 'react-router-dom'

const UserList = lazy(async () => ({
  default: (await import('../components/UserList')).UserList,
}))
const UserDetail = lazy(async () => ({
  default: (await import('../components/UserDetail')).UserDetail,
}))
const UserForm = lazy(async () => ({
  default: (await import('../components/UserForm')).UserForm,
}))

export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      {
        index: true,
        element: <UserList />,
      },
      {
        path: 'new',
        element: <UserForm />,
      },
      {
        path: ':id',
        element: <UserDetail />,
      },
      {
        path: ':id/edit',
        element: <UserForm />,
      },
    ],
  },
]
