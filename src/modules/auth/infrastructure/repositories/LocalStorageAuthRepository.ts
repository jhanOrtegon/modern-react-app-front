import type { AccountWithPassword } from '../../domain/entities/Account'
import type {
  AuthResponse,
  IAuthRepository,
} from '../../domain/repositories/IAuthRepository'
import type {
  LoginFormData,
  RegisterFormData,
} from '../../domain/schemas/authSchema'

const STORAGE_KEY = 'auth_accounts'

export class LocalStorageAuthRepository implements IAuthRepository {
  private getAccounts(): AccountWithPassword[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as AccountWithPassword[]) : []
  }

  private saveAccounts(accounts: AccountWithPassword[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  }

  async register(data: RegisterFormData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const accounts = this.getAccounts()

    if (accounts.some(acc => acc.email === data.email)) {
      throw new Error('El email ya está registrado')
    }

    const newAccount: AccountWithPassword = {
      id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date(),
    }

    accounts.push(newAccount)
    this.saveAccounts(accounts)

    const token = btoa(
      JSON.stringify({ id: newAccount.id, email: newAccount.email })
    )

    const { password: _, ...accountWithoutPassword } = newAccount

    return {
      account: accountWithoutPassword,
      token,
    }
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const accounts = this.getAccounts()

    const account = accounts.find(
      acc => acc.email === data.email && acc.password === data.password
    )

    if (!account) {
      throw new Error('Email o contraseña incorrectos')
    }

    const token = btoa(JSON.stringify({ id: account.id, email: account.email }))

    const { password: _, ...accountWithoutPassword } = account

    return {
      account: accountWithoutPassword,
      token,
    }
  }

  async emailExists(email: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const accounts = this.getAccounts()
    return accounts.some(acc => acc.email === email)
  }
}
