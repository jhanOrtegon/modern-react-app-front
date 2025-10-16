/**
 * DTO (Data Transfer Object) para crear un Account
 *
 * Se utiliza en:
 * - CreateAccountUseCase
 * - AccountRepository.create()
 */
export interface CreateAccountDto {
  name: string
  email: string
}
