import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import { UserValidator } from '../../domain/validators/UserValidator'

import type { CreateUserDto } from '../../domain/dtos'
import type { User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: CreateUserDto): Promise<User> {
    try {
      UserValidator.validate(user)

      logger.info('Creating user', {
        module: 'users',
        email: user.email,
        accountId: user.accountId,
      })

      const createdUser = await this.userRepository.create(user)

      logger.info('User created successfully', {
        module: 'users',
        userId: createdUser.id,
      })

      return createdUser
    } catch (error) {
      logger.error('Error creating user', error as Error, {
        module: 'users',
        email: user.email,
      })
      handleRepositoryError(error, 'crear usuario')
      throw error
    }
  }
}
