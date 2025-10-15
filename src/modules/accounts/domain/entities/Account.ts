/**
 * Account Domain Entity
 * Representa una cuenta en el sistema
 */
export interface Account {
  id: number
  name: string
  email: string
  createdAt?: string
}

/**
 * DTO para crear una nueva cuenta
 */
export interface CreateAccountDto {
  name: string
  email: string
}

/**
 * DTO para actualizar una cuenta existente
 */
export interface UpdateAccountDto {
  id: number
  name: string
  email: string
}
