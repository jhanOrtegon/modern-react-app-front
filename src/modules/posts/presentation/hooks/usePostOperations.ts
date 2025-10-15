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

import type {
  CreatePostDto,
  Post,
  UpdatePostDto,
} from '../../domain/entities/Post'

export function usePosts(): UseQueryResult<Post[]> {
  const account = useAuthStore(state => state.account)

  return useQuery({
    queryKey: ['posts', account?.id, account],
    queryFn: async () => {
      // Obtener el use case en cada fetch para usar el repositorio actual
      const getPostsUseCase = postsContainer.getGetPostsUseCase()
      const allPosts = await getPostsUseCase.execute()

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
    queryKey: ['post', id],
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create post: ${error.message}`)
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
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      void queryClient.invalidateQueries({ queryKey: ['post', variables.id] })
      toast.success('Post updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update post: ${error.message}`)
    },
  })
}

export function useDeletePost(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      // Obtener el use case en cada mutación para usar el repositorio actual
      const deletePostUseCase = postsContainer.getDeletePostUseCase()
      await deletePostUseCase.execute(id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete post: ${error.message}`)
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
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Todos los posts de esta cuenta han sido eliminados!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar posts: ${error.message}`)
    },
  })
}
