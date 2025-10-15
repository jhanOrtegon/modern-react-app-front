import type {
  AuthResponse,
  IAuthRepository,
} from '../../domain/repositories/IAuthRepository'
import type { RegisterFormData } from '../../domain/schemas/authSchema'

/**
 * Caso de uso para registrar una nueva cuenta
 */
export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterFormData): Promise<AuthResponse> {
    return await this.authRepository.register(data)
  }
}
