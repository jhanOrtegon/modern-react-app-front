import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../../../stores/authStore'
import { authContainer } from '../../di/AuthContainer'
import {
  type RegisterFormData,
  registerSchema,
} from '../../domain/schemas/authSchema'

export function useRegisterLogic(): {
  form: UseFormReturn<RegisterFormData>
  onSubmit: (data: RegisterFormData) => void
  isPending: boolean
} {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const registerUseCase = authContainer.getRegisterUseCase()
      return await registerUseCase.execute(data)
    },
    onSuccess: data => {
      setAuth(data.account, data.token)
      toast.success('¡Cuenta creada exitosamente!', {
        description: `Bienvenido ${data.account.name}`,
      })
      navigate('/posts')
    },
    onError: (error: Error) => {
      toast.error('Error al crear la cuenta', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: RegisterFormData): void => {
    registerMutation.mutate(data)
  }

  return {
    form,
    onSubmit,
    isPending: registerMutation.isPending,
  }
}
