import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

import type { Post } from '../../domain/entities/Post'

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
