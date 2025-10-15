import type { Account } from '../entities/Account'
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema'

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  account: Account
  token: string
}

/**
 * Interfaz del repositorio de autenticación
 */
export interface IAuthRepository {
  /**
   * Registrar una nueva cuenta
   */
  register: (data: RegisterFormData) => Promise<AuthResponse>

  /**
   * Iniciar sesión
   */
  login: (data: LoginFormData) => Promise<AuthResponse>

  /**
   * Verificar si un email ya está registrado
   */
  emailExists: (email: string) => Promise<boolean>
}
