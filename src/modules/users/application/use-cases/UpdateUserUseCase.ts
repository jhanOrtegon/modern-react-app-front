import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import { UserValidator } from '../../domain/validators/UserValidator'

import type { UpdateUserDto } from '../../domain/dtos'
import type { User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: UpdateUserDto): Promise<User> {
    try {
      // Validar con UserValidator
      UserValidator.validate(user)

      logger.info('Updating user', {
        module: 'users',
        userId: user.id,
      })

      const updatedUser = await this.userRepository.update(user)

      logger.info('User updated successfully', {
        module: 'users',
        userId: updatedUser.id,
      })

      return updatedUser
    } catch (error) {
      logger.error('Error updating user', error as Error, {
        module: 'users',
        userId: user.id,
      })
      handleRepositoryError(error, 'actualizar usuario')
      throw error
    }
  }
}
