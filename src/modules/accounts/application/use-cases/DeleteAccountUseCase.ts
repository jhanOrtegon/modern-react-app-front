import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class DeleteAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(id: number): Promise<void> {
    await this.accountRepository.delete(id)
  }
}
