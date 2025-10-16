import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { postsContainer } from '../../di/PostsContainer'
import { postQueryKeys } from '../query-keys/postQueryKeys'

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
