import { z } from 'zod'

export const postSchema = z.object({
  userId: z
    .number({
      message: 'User ID is required',
    })
    .int('User ID must be an integer')
    .positive('User ID must be positive'),
  title: z
    .string({
      message: 'Title is required',
    })
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  body: z
    .string({
      message: 'Body is required',
    })
    .min(10, 'Body must be at least 10 characters')
    .max(1000, 'Body must not exceed 1000 characters')
    .trim(),
})

export const postUpdateSchema = postSchema.extend({
  id: z.number().int().positive(),
})

export type PostFormData = z.infer<typeof postSchema>
export type PostUpdateFormData = z.infer<typeof postUpdateSchema>
