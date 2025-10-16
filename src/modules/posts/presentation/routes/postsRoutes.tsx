import { lazy } from 'react'

import type { RouteObject } from 'react-router-dom'

// Lazy load Posts components
const PostList = lazy(async () => ({
  default: (await import('../components/PostList')).PostList,
}))
const PostDetail = lazy(async () => ({
  default: (await import('../components/PostDetail')).PostDetail,
}))
const PostForm = lazy(async () => ({
  default: (await import('../components/PostForm')).PostForm,
}))

/**
 * Rutas del módulo de Posts
 * Estas rutas están protegidas y requieren autenticación
 */
export const postsRoutes: RouteObject[] = [
  {
    path: 'posts',
    children: [
      {
        index: true,
        element: <PostList />,
      },
      {
        path: 'new',
        element: <PostForm />,
      },
      {
        path: ':id',
        element: <PostDetail />,
      },
      {
        path: ':id/edit',
        element: <PostForm />,
      },
    ],
  },
]
