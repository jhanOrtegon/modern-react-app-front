/**
 * DTO (Data Transfer Object) para actualizar un Post existente
 *
 * Se utiliza en:
 * - UpdatePostUseCase
 * - PostValidator
 * - PostRepository.update()
 */
export interface UpdatePostDto {
  id: number
  title: string
  body: string
  userId: number
  accountId: number
}
