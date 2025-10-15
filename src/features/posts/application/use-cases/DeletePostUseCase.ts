import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<void> {
    await this.postRepository.delete(id)
  }
}
