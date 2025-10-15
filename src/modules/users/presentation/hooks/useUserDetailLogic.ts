import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { User } from '../../domain/entities/User'
import { useDeleteUser, useUser } from './useUserOperations'

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
        onClick: () => {
          // Cancel action
        },
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
