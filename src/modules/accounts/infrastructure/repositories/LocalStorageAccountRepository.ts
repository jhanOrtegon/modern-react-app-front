import type { CreateAccountDto, UpdateAccountDto } from '../../domain/dtos'
import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

const STORAGE_KEY = 'accounts_storage'

export class LocalStorageAccountRepository implements IAccountRepository {
  private getAccounts(): Account[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data === null) {
        return []
      }
      return JSON.parse(data) as Account[]
    } catch {
      return []
    }
  }

  private saveAccounts(accounts: Account[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    } catch (error) {
      throw new Error(
        `Failed to save to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private generateId(): number {
    const accounts = this.getAccounts()
    if (accounts.length === 0) {
      return 1
    }
    return Math.max(...accounts.map(a => a.id)) + 1
  }

  findAll = async (): Promise<Account[]> => {
    return await Promise.resolve(this.getAccounts())
  }

  findById = async (id: number): Promise<Account | null> => {
    const accounts = this.getAccounts()
    const account = accounts.find(a => a.id === id)
    return await Promise.resolve(account ?? null)
  }

  create = async (accountDto: CreateAccountDto): Promise<Account> => {
    const accounts = this.getAccounts()

    // Verificar si el email ya existe
    const emailExists = accounts.some(a => a.email === accountDto.email)
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    const newAccount: Account = {
      id: this.generateId(),
      name: accountDto.name,
      email: accountDto.email,
      createdAt: new Date().toISOString(),
    }
    accounts.push(newAccount)
    this.saveAccounts(accounts)
    return await Promise.resolve(newAccount)
  }

  update = async (accountDto: UpdateAccountDto): Promise<Account> => {
    const accounts = this.getAccounts()
    const index = accounts.findIndex(a => a.id === accountDto.id)

    if (index === -1) {
      throw new Error(`Account with id ${String(accountDto.id)} not found`)
    }

    const existingAccount = accounts[index]
    if (existingAccount === undefined) {
      throw new Error(`Account with id ${String(accountDto.id)} not found`)
    }

    // Verificar si el email ya existe en otra cuenta
    const emailExists = accounts.some(
      a => a.email === accountDto.email && a.id !== accountDto.id
    )
    if (emailExists) {
      throw new Error('El email ya está registrado en otra cuenta')
    }

    const updatedAccount: Account = {
      id: existingAccount.id,
      name: accountDto.name,
      email: accountDto.email,
      createdAt: existingAccount.createdAt,
    }

    accounts[index] = updatedAccount
    this.saveAccounts(accounts)
    return await Promise.resolve(updatedAccount)
  }

  delete = async (id: number): Promise<void> => {
    const accounts = this.getAccounts()
    const filteredAccounts = accounts.filter(a => a.id !== id)

    if (accounts.length === filteredAccounts.length) {
      throw new Error(`Account with id ${String(id)} not found`)
    }

    this.saveAccounts(filteredAccounts)
    await Promise.resolve()
  }

  clearAll = async (): Promise<void> => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      await Promise.resolve()
    } catch (error) {
      throw new Error(
        `Failed to clear localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
