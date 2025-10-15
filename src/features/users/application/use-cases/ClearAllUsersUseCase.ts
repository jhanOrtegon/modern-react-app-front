import type { IUserRepository } from '../../domain/repositories/IUserRepository'

/**
 * Use Case para limpiar todos los usuarios del almacenamiento de una cuenta específica
 */
export class ClearAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(accountId: number): Promise<void> {
    if (this.userRepository.clearAll) {
      await this.userRepository.clearAll(accountId)
    } else {
      throw new Error('Clear all operation not supported by this repository')
    }
  }
}
