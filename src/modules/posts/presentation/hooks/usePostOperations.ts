import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { postsContainer } from '../../di/PostsContainer'
import type {
  CreatePostDto,
  Post,
  UpdatePostDto,
} from '../../domain/entities/Post'

export function usePosts(): UseQueryResult<Post[]> {
  const getPostsUseCase = postsContainer.getGetPostsUseCase()

  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => await getPostsUseCase.execute(),
  })
}

export function usePost(id: number | undefined): UseQueryResult<Post | null> {
  const getPostUseCase = postsContainer.getGetPostUseCase()

  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      return await getPostUseCase.execute(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreatePost(): UseMutationResult<Post, Error, CreatePostDto> {
  const createPostUseCase = postsContainer.getCreatePostUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: CreatePostDto) =>
      await createPostUseCase.execute(post),
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
  const updatePostUseCase = postsContainer.getUpdatePostUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: UpdatePostDto) =>
      await updatePostUseCase.execute(post),
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
  const deletePostUseCase = postsContainer.getDeletePostUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
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
