import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}
