import type { Post } from '../../domain/entities/Post'
import { usePosts } from './usePostOperations'

interface UsePostListLogicReturn {
  posts: Post[] | undefined
  isLoading: boolean
  error: Error | null
}

export function usePostListLogic(): UsePostListLogicReturn {
  const { data: posts, isLoading, error } = usePosts()

  return {
    posts,
    isLoading,
    error,
  }
}
