/**
 * Query Keys para el módulo de Users
 *
 * Organiza todas las keys de React Query relacionadas con usuarios
 * siguiendo una estructura jerárquica que facilita la invalidación
 * de cache.
 */
export const userQueryKeys = {
  /**
   * Key raíz para todas las queries de users
   */
  all: ['users'] as const,

  /**
   * Key para todas las listas de users
   */
  lists: () => [...userQueryKeys.all, 'list'] as const,

  /**
   * Key para una lista específica de users por account
   * @param accountId - ID de la cuenta
   */
  list: (accountId: number) => [...userQueryKeys.lists(), accountId] as const,

  /**
   * Key para todos los detalles de users
   */
  details: () => [...userQueryKeys.all, 'detail'] as const,

  /**
   * Key para el detalle de un user específico
   * @param id - ID del usuario
   */
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
}
