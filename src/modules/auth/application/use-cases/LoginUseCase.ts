import type {
  AuthResponse,
  IAuthRepository,
} from '../../domain/repositories/IAuthRepository'
import type { LoginFormData } from '../../domain/schemas/authSchema'

/**
 * Caso de uso para iniciar sesión
 */
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: LoginFormData): Promise<AuthResponse> {
    return await this.authRepository.login(data)
  }
}
