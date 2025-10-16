import { LoginUseCase } from '../application/use-cases/LoginUseCase'
import { RegisterUseCase } from '../application/use-cases/RegisterUseCase'
import { LocalStorageAuthRepository } from '../infrastructure/repositories/LocalStorageAuthRepository'

import type { IAuthRepository } from '../domain/repositories/IAuthRepository'

class AuthContainer {
  private authRepository: IAuthRepository | null = null
  private registerUseCase: RegisterUseCase | null = null
  private loginUseCase: LoginUseCase | null = null

  getAuthRepository(): IAuthRepository {
    this.authRepository ??= new LocalStorageAuthRepository()
    return this.authRepository
  }

  getRegisterUseCase(): RegisterUseCase {
    this.registerUseCase ??= new RegisterUseCase(this.getAuthRepository())
    return this.registerUseCase
  }

  getLoginUseCase(): LoginUseCase {
    this.loginUseCase ??= new LoginUseCase(this.getAuthRepository())
    return this.loginUseCase
  }
}

export const authContainer = new AuthContainer()
