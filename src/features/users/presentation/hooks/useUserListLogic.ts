import type { User } from '../../domain/entities/User'
import { useUsers } from './useUserOperations'

interface UseUserListLogicReturn {
  users: User[] | undefined
  isLoading: boolean
  error: Error | null
}

export function useUserListLogic(): UseUserListLogicReturn {
  const { data: users, isLoading, error } = useUsers()

  return {
    users,
    isLoading,
    error,
  }
}
