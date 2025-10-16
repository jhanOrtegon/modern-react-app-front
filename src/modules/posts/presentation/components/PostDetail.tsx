import type { ReactElement } from 'react'

import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DetailLayout } from '@/components/layout/DetailLayout'
import { FadeIn } from '@/components/shared/FadeIn'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

import { useDeletePost, usePost } from '../hooks'

export function PostDetail(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = id ? parseInt(id, 10) : undefined
  const { data: post, isLoading, error } = usePost(postId)
  const deletePost = useDeletePost()

  const handleDelete = (): void => {
    if (!postId) {
      return
    }

    toast('Are you sure?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          deletePost.mutate(postId, {
            onSuccess: () => {
              navigate('/posts')
            },
          })
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => undefined,
      },
    })
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />
  }

  if (error) {
    return (
      <DetailLayout backLink="/posts">
        <FadeIn>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
            <p className="text-destructive">Error: {error.message}</p>
          </div>
        </FadeIn>
      </DetailLayout>
    )
  }

  if (!post) {
    return (
      <DetailLayout backLink="/posts">
        <FadeIn>
          <div className="rounded-lg border bg-muted p-4 text-center">
            <p className="text-muted-foreground">Post not found</p>
          </div>
        </FadeIn>
      </DetailLayout>
    )
  }

  const actions = (
    <>
      <Button asChild variant="outline">
        <Link to={`/posts/${String(post.id)}/edit`}>
          <Edit className="mr-2 size-4" />
          Edit
        </Link>
      </Button>
      <Button
        disabled={deletePost.isPending}
        variant="destructive"
        onClick={handleDelete}
      >
        <Trash2 className="mr-2 size-4" />
        Delete
      </Button>
    </>
  )

  return (
    <DetailLayout actions={actions} backLink="/posts" isLoading={isLoading}>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4 text-sm text-muted-foreground">
          User ID: {post.userId}
        </div>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-3xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {post.title}
        </motion.h1>
        <motion.p
          animate={{ opacity: 1 }}
          className="text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {post.body}
        </motion.p>
      </motion.div>
    </DetailLayout>
  )
}
