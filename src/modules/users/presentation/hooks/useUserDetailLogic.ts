import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useDeleteUser, useUser } from './useUserOperations'

import type { User } from '../../domain/entities/User'

interface UseUserDetailLogicReturn {
  user: User | null | undefined
  isLoading: boolean
  error: Error | null
  handleDelete: () => void
  isDeleting: boolean
}

export function useUserDetailLogic(userId?: number): UseUserDetailLogicReturn {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useUser(userId)
  const deleteUser = useDeleteUser()

  const handleDelete = (): void => {
    if (!userId) {
      return
    }

    toast('Are you sure?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteUser.mutate(userId, {
            onSuccess: () => {
              navigate('/users')
            },
          })
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => undefined,
      },
    })
  }

  return {
    user,
    isLoading,
    error,
    handleDelete,
    isDeleting: deleteUser.isPending,
  }
}
