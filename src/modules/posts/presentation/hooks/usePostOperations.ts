import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export function usePosts(): UseQueryResult<Post[]> {
  const account = useAuthStore(state => state.account)

  return useQuery({
    queryKey: [...postQueryKeys.list(account?.id ?? 0), account],
    queryFn: async () => {
      const getPostsUseCase = postsContainer.getGetPostsUseCase()

      const allPosts = await getPostsUseCase.execute(account?.id)

      if (account) {
        return allPosts.filter(post => post.accountId === account.id)
      }
      return allPosts
    },
    enabled: Boolean(account),
  })
}

export function usePost(id: number | undefined): UseQueryResult<Post | null> {
  return useQuery({
    queryKey: postQueryKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) {
        return null
      }

      const getPostUseCase = postsContainer.getGetPostUseCase()
      return await getPostUseCase.execute(id)
    },
    enabled: Boolean(id),
  })
}

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

export function useClearAllPosts(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Debes iniciar sesión para eliminar posts')
      }

      const clearAllPostsUseCase = postsContainer.getClearAllPostsUseCase()
      await clearAllPostsUseCase.execute(account.id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      toast.success('Todos los posts de esta cuenta han sido eliminados!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar posts: ${error.message}`)
    },
  })
}
