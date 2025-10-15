import type { CreateUserDto, User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: CreateUserDto): Promise<User> {
    if (!user.name || user.name.trim() === '') {
      throw new Error('Name is required')
    }
    if (!user.email || user.email.trim() === '') {
      throw new Error('Email is required')
    }
    if (!user.email.includes('@')) {
      throw new Error('Email must be valid')
    }
    return await this.userRepository.create(user)
  }
}
