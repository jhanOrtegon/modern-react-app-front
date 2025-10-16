/**
 * DTO (Data Transfer Object) para actualizar un Account existente
 *
 * Se utiliza en:
 * - UpdateAccountUseCase
 * - AccountRepository.update()
 */
export interface UpdateAccountDto {
  id: number
  name: string
  email: string
}
