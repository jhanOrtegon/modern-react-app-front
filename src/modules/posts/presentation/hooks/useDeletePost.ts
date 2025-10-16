import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

import type { Post } from '../../domain/entities/Post'

export function useDeletePost(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (id: number) => {
      const deletePostUseCase = postsContainer.getDeletePostUseCase()
      await deletePostUseCase.execute(id)
    },

    onMutate: async (deletedId: number) => {
      if (!account) {
        return
      }

      const queryKey = [...postQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      const previousPosts = queryClient.getQueryData<Post[]>(queryKey)

      queryClient.setQueryData<Post[]>(queryKey, old =>
        old?.filter(post => post.id !== deletedId)
      )

      return { previousPosts, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      toast.success('Post deleted successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(context.queryKey, context.previousPosts)
      }
      toast.error(`Failed to delete post: ${error.message}`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
    },
  })
}
