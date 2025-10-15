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

/**
 * Repositorio de autenticación usando LocalStorage
 */
export class LocalStorageAuthRepository implements IAuthRepository {
  private getAccounts(): AccountWithPassword[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as AccountWithPassword[]) : []
  }

  private saveAccounts(accounts: AccountWithPassword[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  }

  async register(data: RegisterFormData): Promise<AuthResponse> {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500))

    const accounts = this.getAccounts()

    // Verificar si el email ya existe
    if (accounts.some(acc => acc.email === data.email)) {
      throw new Error('El email ya está registrado')
    }

    // Crear nueva cuenta
    const newAccount: AccountWithPassword = {
      id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
      email: data.email,
      name: data.name,
      password: data.password, // En producción esto debería estar hasheado
      createdAt: new Date(),
    }

    accounts.push(newAccount)
    this.saveAccounts(accounts)

    // Generar token simple (en producción usar JWT)
    const token = btoa(
      JSON.stringify({ id: newAccount.id, email: newAccount.email })
    )

    // Retornar sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...accountWithoutPassword } = newAccount

    return {
      account: accountWithoutPassword,
      token,
    }
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500))

    const accounts = this.getAccounts()

    // Buscar cuenta
    const account = accounts.find(
      acc => acc.email === data.email && acc.password === data.password
    )

    if (!account) {
      throw new Error('Email o contraseña incorrectos')
    }

    // Generar token
    const token = btoa(JSON.stringify({ id: account.id, email: account.email }))

    // Retornar sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...accountWithoutPassword } = account

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
