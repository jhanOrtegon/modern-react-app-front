import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useDeletePost, usePost } from './usePostOperations'

import type { Post } from '../../domain/entities/Post'

interface UsePostDetailLogicReturn {
  post: Post | null | undefined
  isLoading: boolean
  error: Error | null
  handleDelete: () => void
  isDeleting: boolean
}

export function usePostDetailLogic(postId?: number): UsePostDetailLogicReturn {
  const navigate = useNavigate()
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
        onClick: () => {
          // Cancel action
        },
      },
    })
  }

  return {
    post,
    isLoading,
    error,
    handleDelete,
    isDeleting: deletePost.isPending,
  }
}
