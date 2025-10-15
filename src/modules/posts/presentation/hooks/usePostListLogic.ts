import { usePosts } from './usePostOperations'

import type { Post } from '../../domain/entities/Post'

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
