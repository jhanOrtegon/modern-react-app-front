/**
 * Entidad de dominio User
 *
 * Representa un Usuario en el sistema.
 * Esta entidad solo contiene la estructura de datos,
 * las validaciones están en UserValidator,
 * y los DTOs están en domain/dtos/
 */
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  accountId: number // ID de la cuenta propietaria
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
