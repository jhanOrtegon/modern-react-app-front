import type { UpdateAccountDto } from '../../domain/dtos'
import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class UpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(account: UpdateAccountDto): Promise<Account> {
    return await this.accountRepository.update(account)
  }
}
