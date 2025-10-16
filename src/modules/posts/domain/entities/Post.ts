/**
 * Entidad de dominio Post
 *
 * Representa un Post en el sistema.
 * Esta entidad solo contiene la estructura de datos,
 * las validaciones están en PostValidator,
 * y los DTOs están en domain/dtos/
 */
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  accountId: number // ID de la cuenta propietaria
}
