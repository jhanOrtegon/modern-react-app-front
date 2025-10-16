import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class GetAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(id: number): Promise<Account | null> {
    return await this.accountRepository.findById(id)
  }
}
