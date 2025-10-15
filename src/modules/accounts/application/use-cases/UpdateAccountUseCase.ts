import type { Account, UpdateAccountDto } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

/**
 * Use Case para actualizar una cuenta existente
 */
export class UpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(account: UpdateAccountDto): Promise<Account> {
    return await this.accountRepository.update(account)
  }
}
