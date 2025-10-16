/**
 * Query Keys para el módulo de Posts
 *
 * Organiza todas las keys de React Query relacionadas con posts
 * siguiendo una estructura jerárquica que facilita la invalidación
 * de cache.
 *
 * @example
 * ```ts
 * // En un hook
 * const { data } = useQuery({
 *   queryKey: postQueryKeys.list(accountId),
 *   queryFn: () => fetchPosts(accountId)
 * })
 *
 * // Invalidar todas las listas
 * queryClient.invalidateQueries({
 *   queryKey: postQueryKeys.lists()
 * })
 * ```
 */
export const postQueryKeys = {
  /**
   * Key raíz para todas las queries de posts
   * Útil para invalidar TODO relacionado con posts
   */
  all: ['posts'] as const,

  /**
   * Key para todas las listas de posts
   */
  lists: () => [...postQueryKeys.all, 'list'] as const,

  /**
   * Key para una lista específica de posts por account
   * @param accountId - ID de la cuenta
   */
  list: (accountId: number) => [...postQueryKeys.lists(), accountId] as const,

  /**
   * Key para todos los detalles de posts
   */
  details: () => [...postQueryKeys.all, 'detail'] as const,

  /**
   * Key para el detalle de un post específico
   * @param id - ID del post
   */
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
}
