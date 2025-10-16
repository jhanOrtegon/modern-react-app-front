import { z } from 'zod'

/**
 * Schema de validación para crear un User
 * Auto-genera el tipo CreateUserDto con z.infer<>
 */
export const createUserSchema = z.object({
  accountId: z
    .number({ message: 'Account ID must be a number' })
    .int('Account ID must be an integer')
    .positive('Account ID must be positive'),

  name: z
    .string({ message: 'Name must be a string' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  username: z
    .string({ message: 'Username must be a string' })
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .trim(),

  email: z
    .string({ message: 'Email must be a string' })
    .trim()
    .toLowerCase()
    .pipe(z.email('Invalid email address')),

  phone: z
    .string({ message: 'Phone must be a string' })
    .min(7, 'Phone must be at least 7 characters')
    .max(20, 'Phone must be less than 20 characters')
    .trim(),

  website: z
    .string({ message: 'Website must be a string' })
    .transform(val => val.trim())
    .pipe(z.url('Invalid URL').or(z.literal('')))
    .optional()
    .transform(val => val ?? ''),
})

/**
 * Schema de validación para actualizar un User
 * Extiende createUserSchema y agrega id
 */
export const updateUserSchema = createUserSchema.extend({
  id: z
    .number({ message: 'ID must be a number' })
    .int('ID must be an integer')
    .positive('ID must be positive'),
})

/**
 * Tipo CreateUserDto auto-generado desde schema
 * Esto garantiza que el DTO y la validación siempre están sincronizados
 */
export type CreateUserDto = z.infer<typeof createUserSchema>

/**
 * Tipo UpdateUserDto auto-generado desde schema
 */
export type UpdateUserDto = z.infer<typeof updateUserSchema>
