import type { UpdateUserDto, User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: UpdateUserDto): Promise<User> {
    if (!user.name || user.name.trim() === '') {
      throw new Error('Name is required')
    }
    if (!user.email || user.email.trim() === '') {
      throw new Error('Email is required')
    }
    if (!user.email.includes('@')) {
      throw new Error('Email must be valid')
    }
    return await this.userRepository.update(user)
  }
}
