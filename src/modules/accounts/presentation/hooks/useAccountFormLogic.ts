import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  useAccount,
  useCreateAccount,
  useUpdateAccount,
} from './useAccountOperations'
import {
  type AccountFormData,
  accountSchema,
  type AccountUpdateFormData,
  accountUpdateSchema,
} from '../../domain/schemas/accountSchema'

interface UseAccountFormLogicReturn {
  form: UseFormReturn<AccountFormData | AccountUpdateFormData>
  onSubmit: (data: AccountFormData | AccountUpdateFormData) => void
  isPending: boolean
  isLoadingAccount: boolean
  isEditing: boolean
  backLink: string
}

export function useAccountFormLogic(
  accountId?: number
): UseAccountFormLogicReturn {
  const navigate = useNavigate()
  const isEditing = Boolean(accountId)

  // Fetch existing account if editing
  const { data: existingAccount, isLoading: isLoadingAccount } =
    useAccount(accountId)

  // Mutations
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()

  // Setup form with proper schema based on mode
  const form = useForm<AccountFormData | AccountUpdateFormData>({
    resolver: zodResolver(isEditing ? accountUpdateSchema : accountSchema),
    defaultValues: {
      name: '',
      email: '',
      ...(isEditing && accountId ? { id: accountId } : {}),
    },
  })

  // Load existing data when available
  useEffect(() => {
    if (existingAccount && isEditing) {
      form.reset({
        name: existingAccount.name,
        email: existingAccount.email,
        ...(accountId ? { id: accountId } : {}),
      })
    }
  }, [existingAccount, isEditing, form, accountId])

  // Handle form submission
  const onSubmit = (data: AccountFormData | AccountUpdateFormData): void => {
    if (isEditing && accountId && 'id' in data) {
      updateAccount.mutate(data, {
        onSuccess: () => {
          navigate(`/accounts/${accountId}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to update account',
          })
        },
      })
    } else {
      createAccount.mutate(data as AccountFormData, {
        onSuccess: newAccount => {
          navigate(`/accounts/${newAccount.id}`)
        },
        onError: error => {
          form.setError('root', {
            message: error.message || 'Failed to create account',
          })
        },
      })
    }
  }

  const isPending = createAccount.isPending || updateAccount.isPending
  const backLink =
    isEditing && accountId ? `/accounts/${accountId}` : '/accounts'

  return {
    form,
    onSubmit,
    isPending,
    isLoadingAccount,
    isEditing,
    backLink,
  }
}
