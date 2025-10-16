/**
 * Query Keys para el módulo de Accounts
 *
 * Organiza todas las keys de React Query relacionadas con cuentas.
 */
export const accountQueryKeys = {
  /**
   * Key raíz para todas las queries de accounts
   */
  all: ['accounts'] as const,

  /**
   * Key para todas las listas de accounts
   */
  lists: () => [...accountQueryKeys.all, 'list'] as const,

  /**
   * Key para todos los detalles de accounts
   */
  details: () => [...accountQueryKeys.all, 'detail'] as const,

  /**
   * Key para el detalle de un account específico
   * @param id - ID de la cuenta
   */
  detail: (id: number) => [...accountQueryKeys.details(), id] as const,
}
