/**
 * Entidad de dominio Account
 *
 * Representa una Cuenta en el sistema.
 * Esta entidad solo contiene la estructura de datos,
 * los DTOs están en domain/dtos/
 */
export interface Account {
  id: number
  name: string
  email: string
  createdAt?: string
}
