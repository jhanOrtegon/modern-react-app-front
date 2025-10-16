import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string({
        message: 'El nombre es requerido',
      })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no debe exceder 50 caracteres')
      .trim(),
    email: z
      .string({
        message: 'El email es requerido',
      })
      .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'Por favor ingresa un email válido',
      })
      .transform(val => val.trim().toLowerCase()),
    password: z
      .string({
        message: 'La contraseña es requerida',
      })
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(50, 'La contraseña no debe exceder 50 caracteres'),
    confirmPassword: z.string({
      message: 'Debes confirmar la contraseña',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z
    .string({
      message: 'El email es requerido',
    })
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Por favor ingresa un email válido',
    })
    .transform(val => val.trim().toLowerCase()),
  password: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(1, 'La contraseña es requerida'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
