/**
 * DTO (Data Transfer Object) para crear un Post
 *
 * Se utiliza en:
 * - CreatePostUseCase
 * - PostValidator
 * - PostRepository.create()
 */
export interface CreatePostDto {
  title: string
  body: string
  userId: number
  accountId: number
}
