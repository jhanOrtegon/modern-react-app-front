import { z } from 'zod'

export const userSchema = z.object({
  name: z
    .string({
      message: 'Name is required',
    })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  username: z
    .string({
      message: 'Username is required',
    })
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .trim(),
  email: z
    .string({
      message: 'Email is required',
    })
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string({
      message: 'Phone is required',
    })
    .min(7, 'Phone must be at least 7 characters')
    .max(20, 'Phone must not exceed 20 characters')
    .trim(),
  website: z
    .string({
      message: 'Website is required',
    })
    .trim()
    .refine(
      val => {
        try {
          new URL(val.startsWith('http') ? val : `https://${val}`)
          return true
        } catch {
          return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
        }
      },
      { message: 'Please enter a valid website URL' }
    ),
})

export const userUpdateSchema = userSchema.extend({
  id: z.number().int().positive(),
})

export type UserFormData = z.infer<typeof userSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
