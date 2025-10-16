import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class ClearAllAccountsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(): Promise<void> {
    if (this.accountRepository.clearAll) {
      await this.accountRepository.clearAll()
    } else {
      throw new Error('Clear all operation not supported by this repository')
    }
  }
}
