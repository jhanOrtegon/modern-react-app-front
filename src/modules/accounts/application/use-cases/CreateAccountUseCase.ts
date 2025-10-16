import type { CreateAccountDto } from '../../domain/dtos'
import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(account: CreateAccountDto): Promise<Account> {
    return await this.accountRepository.create(account)
  }
}
