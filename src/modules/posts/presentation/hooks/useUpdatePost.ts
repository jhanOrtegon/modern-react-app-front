import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

import type { UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export function useUpdatePost(): UseMutationResult<Post, Error, UpdatePostDto> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (post: UpdatePostDto) => {
      if (!account) {
        throw new Error('Debes iniciar sesión para actualizar un post')
      }

      const updatePostUseCase = postsContainer.getUpdatePostUseCase()

      return await updatePostUseCase.execute({
        ...post,
        accountId: account.id,
      })
    },

    onMutate: async (updatedPost: UpdatePostDto) => {
      if (!account) {
        return
      }

      const listQueryKey = [...postQueryKeys.list(account.id), account]
      const detailQueryKey = postQueryKeys.detail(updatedPost.id)

      await queryClient.cancelQueries({ queryKey: listQueryKey })
      await queryClient.cancelQueries({ queryKey: detailQueryKey })

      const previousPostsList = queryClient.getQueryData<Post[]>(listQueryKey)
      const previousPost = queryClient.getQueryData<Post>(detailQueryKey)

      queryClient.setQueryData<Post[]>(listQueryKey, old =>
        old?.map(post =>
          post.id === updatedPost.id
            ? { ...post, ...updatedPost, accountId: account.id }
            : post
        )
      )

      queryClient.setQueryData<Post>(detailQueryKey, old =>
        old ? { ...old, ...updatedPost, accountId: account.id } : old
      )

      return { previousPostsList, previousPost, listQueryKey, detailQueryKey }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.id),
      })
      toast.success('Post updated successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousPostsList) {
        queryClient.setQueryData(
          context.listQueryKey,
          context.previousPostsList
        )
      }
      if (context?.previousPost) {
        queryClient.setQueryData(context.detailQueryKey, context.previousPost)
      }
      toast.error(`Failed to update post: ${error.message}`)
    },
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.id),
      })
    },
  })
}
