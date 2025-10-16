import { z } from 'zod'

export const accountSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Por favor ingresa un email válido',
    }),
})

export const accountUpdateSchema = accountSchema.extend({
  id: z.number().int().positive('El ID debe ser un número positivo'),
})

export type AccountFormData = z.infer<typeof accountSchema>
export type AccountUpdateFormData = z.infer<typeof accountUpdateSchema>
