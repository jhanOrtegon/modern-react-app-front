import { z } from 'zod'

/**
 * Schema de validación para crear un Post
 * Auto-genera el tipo CreatePostDto con z.infer<>
 */
export const createPostSchema = z.object({
  accountId: z
    .number({ message: 'Account ID must be a number' })
    .int('Account ID must be an integer')
    .positive('Account ID must be positive'),

  userId: z
    .number({ message: 'User ID must be a number' })
    .int('User ID must be an integer')
    .positive('User ID must be positive'),

  title: z
    .string({ message: 'Title must be a string' })
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),

  body: z
    .string({ message: 'Body must be a string' })
    .min(10, 'Body must be at least 10 characters')
    .max(5000, 'Body must be less than 5000 characters')
    .trim(),
})

/**
 * Schema de validación para actualizar un Post
 * Extiende createPostSchema y agrega id
 */
export const updatePostSchema = createPostSchema.extend({
  id: z
    .number({ message: 'ID must be a number' })
    .int('ID must be an integer')
    .positive('ID must be positive'),
})

/**
 * Tipo CreatePostDto auto-generado desde schema
 * Esto garantiza que el DTO y la validación siempre están sincronizados
 */
export type CreatePostDto = z.infer<typeof createPostSchema>

/**
 * Tipo UpdatePostDto auto-generado desde schema
 */
export type UpdatePostDto = z.infer<typeof updatePostSchema>
