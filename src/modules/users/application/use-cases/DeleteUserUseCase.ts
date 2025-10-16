import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    try {
      logger.info('Deleting user', {
        module: 'users',
        userId: id,
      })

      await this.userRepository.delete(id)

      logger.info('User deleted successfully', {
        module: 'users',
        userId: id,
      })
    } catch (error) {
      logger.error('Error deleting user', error as Error, {
        module: 'users',
        userId: id,
      })
      handleRepositoryError(error, 'eliminar usuario')
      throw error
    }
  }
}
