import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useCreateUser, useUpdateUser, useUser } from './useUserOperations'
import {
  type UserFormData,
  userSchema,
  type UserUpdateFormData,
  userUpdateSchema,
} from '../../domain/schemas/userSchema'

import type { CreateUserDto, UpdateUserDto } from '../../domain/dtos'

interface UseUserFormLogicReturn {
  form: UseFormReturn<UserFormData | UserUpdateFormData>
  onSubmit: (data: UserFormData | UserUpdateFormData) => void
  isPending: boolean
  isLoadingUser: boolean
  isEditing: boolean
  backLink: string
}

export function useUserFormLogic(userId?: number): UseUserFormLogicReturn {
  const navigate = useNavigate()
  const isEditing = Boolean(userId)

  const { data: existingUser, isLoading: isLoadingUser } = useUser(userId)

  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const form = useForm<UserFormData | UserUpdateFormData>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userSchema),
    defaultValues: {
      accountId: undefined,
      name: '',
      username: '',
      email: '',
      phone: '',
      website: '',
      ...(isEditing && userId ? { id: userId } : {}),
    },
  })

  useEffect(() => {
    if (existingUser && isEditing) {
      form.reset({
        accountId: existingUser.accountId,
        name: existingUser.name,
        username: existingUser.username,
        email: existingUser.email,
        phone: existingUser.phone,
        website: existingUser.website,
        ...(userId ? { id: userId } : {}),
      })
    }
  }, [existingUser, isEditing, form, userId])

  const onSubmit = (data: UserFormData | UserUpdateFormData): void => {
    if (isEditing && userId && 'id' in data) {
      updateUser.mutate(data as UpdateUserDto, {
        onSuccess: () => {
          navigate(`/users/${userId}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to update user',
          })
        },
      })
    } else {
      createUser.mutate(data as CreateUserDto, {
        onSuccess: newUser => {
          navigate(`/users/${newUser.id}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to create user',
          })
        },
      })
    }
  }

  const isPending = createUser.isPending || updateUser.isPending
  const backLink = isEditing && userId ? `/users/${userId}` : '/users'

  return {
    form,
    onSubmit,
    isPending,
    isLoadingUser,
    isEditing,
    backLink,
  }
}
