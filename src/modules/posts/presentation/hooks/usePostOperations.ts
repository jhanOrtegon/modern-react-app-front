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
      // Obtener el use case en cada fetch para usar el repositorio actual
      const getPostsUseCase = postsContainer.getGetPostsUseCase()
      // Pasar accountId al use case para que el adapter lo use
      const allPosts = await getPostsUseCase.execute(account?.id)

      // Filtrar posts por cuenta actual
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
      // Obtener el use case en cada fetch para usar el repositorio actual
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

      // Obtener el use case en cada mutación para usar el repositorio actual
      const createPostUseCase = postsContainer.getCreatePostUseCase()
      // Agregar accountId automáticamente
      return await createPostUseCase.execute({
        ...post,
        accountId: account.id,
      })
    },
    // ✨ OPTIMISTIC UPDATE
    onMutate: async (newPost: CreatePostDto) => {
      if (!account) {
        return
      }

      // 1. Cancelar queries en progreso para evitar race conditions
      const queryKey = [...postQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      // 2. Snapshot del estado actual (para rollback)
      const previousPosts = queryClient.getQueryData<Post[]>(queryKey)

      // 3. Optimistically update UI con ID temporal
      queryClient.setQueryData<Post[]>(queryKey, old => [
        ...(old ?? []),
        {
          ...newPost,
          id: Date.now(), // ID temporal
          accountId: account.id,
        },
      ])

      // 4. Retornar contexto para rollback
      return { previousPosts, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      toast.success('Post created successfully!')
    },
    onError: (error: Error, _, context) => {
      // Rollback en caso de error
      if (context?.previousPosts) {
        queryClient.setQueryData(context.queryKey, context.previousPosts)
      }
      toast.error(`Failed to create post: ${error.message}`)
    },
    onSettled: () => {
      // Refetch para sincronizar con servidor (con el ID real)
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

      // Obtener el use case en cada mutación para usar el repositorio actual
      const updatePostUseCase = postsContainer.getUpdatePostUseCase()
      // Agregar accountId automáticamente
      return await updatePostUseCase.execute({
        ...post,
        accountId: account.id,
      })
    },
    // ✨ OPTIMISTIC UPDATE
    onMutate: async (updatedPost: UpdatePostDto) => {
      if (!account) {
        return
      }

      // 1. Cancelar queries
      const listQueryKey = [...postQueryKeys.list(account.id), account]
      const detailQueryKey = postQueryKeys.detail(updatedPost.id)

      await queryClient.cancelQueries({ queryKey: listQueryKey })
      await queryClient.cancelQueries({ queryKey: detailQueryKey })

      // 2. Snapshot
      const previousPostsList = queryClient.getQueryData<Post[]>(listQueryKey)
      const previousPost = queryClient.getQueryData<Post>(detailQueryKey)

      // 3. Optimistic update
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

      // 4. Retornar contexto
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
      // Rollback
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
      // Obtener el use case en cada mutación para usar el repositorio actual
      const deletePostUseCase = postsContainer.getDeletePostUseCase()
      await deletePostUseCase.execute(id)
    },
    // ✨ OPTIMISTIC UPDATE
    onMutate: async (deletedId: number) => {
      if (!account) {
        return
      }

      // 1. Cancelar queries
      const queryKey = [...postQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      // 2. Snapshot
      const previousPosts = queryClient.getQueryData<Post[]>(queryKey)

      // 3. Optimistic delete (remover de la UI inmediatamente)
      queryClient.setQueryData<Post[]>(queryKey, old =>
        old?.filter(post => post.id !== deletedId)
      )

      // 4. Retornar contexto
      return { previousPosts, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
      toast.success('Post deleted successfully!')
    },
    onError: (error: Error, _, context) => {
      // Rollback
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
