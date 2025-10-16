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

  // Fetch existing user if editing
  const { data: existingUser, isLoading: isLoadingUser } = useUser(userId)

  // Mutations
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  // Setup form with proper schema based on mode
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

  // Load existing data when available
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

  // Handle form submission
  const onSubmit = (data: UserFormData | UserUpdateFormData): void => {
    if (isEditing && userId && 'id' in data) {
      // El accountId se agrega automáticamente en useUpdateUser
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
      // El accountId se agrega automáticamente en useCreateUser
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
