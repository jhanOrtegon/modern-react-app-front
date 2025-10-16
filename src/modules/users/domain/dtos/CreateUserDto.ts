/**
 * DTO (Data Transfer Object) para crear un User
 *
 * Se utiliza en:
 * - CreateUserUseCase
 * - UserValidator
 * - UserRepository.create()
 */
export interface CreateUserDto {
  name: string
  username: string
  email: string
  phone: string
  website: string
  accountId: number
}
