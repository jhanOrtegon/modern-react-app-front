import type { User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User | null> {
    return await this.userRepository.findById(id)
  }
}
