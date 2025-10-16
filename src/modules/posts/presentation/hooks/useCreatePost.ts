import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

import type { CreatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export function useCreatePost(): UseMutationResult<Post, Error, CreatePostDto> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (post: CreatePostDto) => {
      if (!account) {
        throw new Error('Debes iniciar sesión para crear un post')
      }

      const createPostUseCase = postsContainer.getCreatePostUseCase()

      return await createPostUseCase.execute({
        ...post,
        accountId: account.id,
      })
    },

    onMutate: async (newPost: CreatePostDto) => {
      if (!account) {
        return
      }

      const queryKey = [...postQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      const previousPosts = queryClient.getQueryData<Post[]>(queryKey)

      queryClient.setQueryData<Post[]>(queryKey, old => [
        ...(old ?? []),
        {
          ...newPost,
          id: Date.now(),
          accountId: account.id,
        },
      ])

      return { previousPosts, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      toast.success('Post created successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(context.queryKey, context.previousPosts)
      }
      toast.error(`Failed to create post: ${error.message}`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
    },
  })
}
