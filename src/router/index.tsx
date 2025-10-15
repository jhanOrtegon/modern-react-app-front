import { Loader2 } from 'lucide-react'
import { lazy, type ReactElement, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'

// Lazy load Posts components
const PostList = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostList'))
    .PostList,
}))
const PostDetail = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostDetail'))
    .PostDetail,
}))
const PostForm = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostForm'))
    .PostForm,
}))

// Lazy load Users components
const UserList = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserList'))
    .UserList,
}))
const UserDetail = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserDetail'))
    .UserDetail,
}))
const UserForm = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserForm'))
    .UserForm,
}))

function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate replace to="/posts" />,
      },
      // Posts Module Routes
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
      // Users Module Routes
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
      {
        path: '*',
        element: <Navigate replace to="/posts" />,
      },
    ],
  },
])
