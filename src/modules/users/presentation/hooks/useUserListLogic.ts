import { useUsers } from './useUserOperations'

import type { User } from '../../domain/entities/User'

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
