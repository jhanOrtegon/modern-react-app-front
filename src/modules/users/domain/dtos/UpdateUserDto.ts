import type { CreateUserDto } from './CreateUserDto'

/**
 * DTO (Data Transfer Object) para actualizar un User existente
 *
 * Extiende CreateUserDto y agrega el id.
 *
 * Se utiliza en:
 * - UpdateUserUseCase
 * - UserValidator
 * - UserRepository.update()
 */
export interface UpdateUserDto extends CreateUserDto {
  id: number
}
