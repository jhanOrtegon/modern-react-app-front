import type { Account } from '../entities/Account'
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema'

export interface AuthResponse {
  account: Account
  token: string
}

export interface IAuthRepository {
  register: (data: RegisterFormData) => Promise<AuthResponse>

  login: (data: LoginFormData) => Promise<AuthResponse>

  emailExists: (email: string) => Promise<boolean>
}
