import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

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
