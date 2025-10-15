/**
 * Factory de Query Keys para React Query
 *
 * Organiza todas las keys de queries de forma centralizada y type-safe
 * Facilita la invalidación y gestión del cache
 *
 * @example
 * ```typescript
 * // En un hook
 * const { data } = useQuery({
 *   queryKey: queryKeys.posts.list(accountId),
 *   queryFn: () => getPostsUseCase.execute(accountId),
 * })
 *
 * // Invalidar cache
 * queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
 * ```
 */
export const queryKeys = {
  /**
   * Query keys para Posts
   */
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (accountId: number) =>
      [...queryKeys.posts.lists(), accountId] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
  },

  /**
   * Query keys para Users
   */
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (accountId: number) =>
      [...queryKeys.users.lists(), accountId] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  /**
   * Query keys para Accounts
   */
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...queryKeys.accounts.all, 'list'] as const,
    list: () => [...queryKeys.accounts.lists()] as const,
    details: () => [...queryKeys.accounts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.accounts.details(), id] as const,
  },
} as const
