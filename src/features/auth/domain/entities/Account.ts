/**
 * Entidad Account - Representa una cuenta de usuario en el sistema
 */
export interface Account {
  id: number
  email: string
  name: string
  createdAt: Date
}

/**
 * Entidad con contraseña para operaciones internas
 */
export interface AccountWithPassword extends Account {
  password: string
}
