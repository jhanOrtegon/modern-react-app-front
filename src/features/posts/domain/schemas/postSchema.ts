import { z } from 'zod'

export const postSchema = z.object({
  accountId: z
    .number({
      message: 'La cuenta es requerida',
    })
    .int('El ID de cuenta debe ser un número entero')
    .positive('Debes seleccionar una cuenta'),
  userId: z
    .number({
      message: 'El ID de usuario es requerido',
    })
    .int('El ID de usuario debe ser un número entero')
    .positive('El ID de usuario debe ser positivo'),
  title: z
    .string({
      message: 'El título es requerido',
    })
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no debe exceder 100 caracteres')
    .trim(),
  body: z
    .string({
      message: 'El contenido es requerido',
    })
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(1000, 'El contenido no debe exceder 1000 caracteres')
    .trim(),
})

export const postUpdateSchema = postSchema.extend({
  id: z.number().int().positive(),
})

export type PostFormData = z.infer<typeof postSchema>
export type PostUpdateFormData = z.infer<typeof postUpdateSchema>
