import type { Account, CreateAccountDto } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

/**
 * Use Case para crear una nueva cuenta
 */
export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(account: CreateAccountDto): Promise<Account> {
    return await this.accountRepository.create(account)
  }
}
