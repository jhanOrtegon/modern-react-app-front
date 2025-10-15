import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { authContainer } from '../../di/AuthContainer'
import {
  type LoginFormData,
  loginSchema,
} from '../../domain/schemas/authSchema'
import { useAuthStore } from '../../infrastructure/stores'

import type { UseFormReturn } from 'react-hook-form'

export function useLoginLogic(): {
  form: UseFormReturn<LoginFormData>
  onSubmit: (data: LoginFormData) => void
  isPending: boolean
} {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const loginUseCase = authContainer.getLoginUseCase()
      return await loginUseCase.execute(data)
    },
    onSuccess: data => {
      setAuth(data.account, data.token)
      toast.success('¡Bienvenido!', {
        description: `Has iniciado sesión como ${data.account.name}`,
      })
      navigate('/posts')
    },
    onError: (error: Error) => {
      toast.error('Error al iniciar sesión', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: LoginFormData): void => {
    loginMutation.mutate(data)
  }

  return {
    form,
    onSubmit,
    isPending: loginMutation.isPending,
  }
}
