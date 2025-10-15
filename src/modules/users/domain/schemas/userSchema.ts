import { z } from 'zod'

export const userSchema = z.object({
  accountId: z
    .number({
      message: 'La cuenta es requerida',
    })
    .int('El ID de cuenta debe ser un número entero')
    .positive('Debes seleccionar una cuenta'),
  name: z
    .string({
      message: 'El nombre es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder 50 caracteres')
    .trim(),
  username: z
    .string({
      message: 'El nombre de usuario es requerido',
    })
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no debe exceder 20 caracteres')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'El nombre de usuario solo puede contener letras, números, guiones bajos y guiones'
    )
    .trim(),
  email: z
    .string({
      message: 'El email es requerido',
    })
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    .email('Por favor ingresa un email válido')
    .trim()
    .toLowerCase(),
  phone: z
    .string({
      message: 'El teléfono es requerido',
    })
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no debe exceder 20 caracteres')
    .trim(),
  website: z
    .string({
      message: 'El sitio web es requerido',
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
      { message: 'Por favor ingresa una URL válida' }
    ),
})

export const userUpdateSchema = userSchema.extend({
  id: z.number().int().positive(),
})

export type UserFormData = z.infer<typeof userSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
