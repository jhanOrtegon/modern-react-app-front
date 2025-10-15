import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/authStore'

import { usersContainer } from '../../di/UsersContainer'
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'

export function useUsers(): UseQueryResult<User[]> {
  const account = useAuthStore(state => state.account)

  return useQuery({
    queryKey: ['users', account?.id, account],
    queryFn: async () => {
      // Obtener el use case en cada fetch para usar el repositorio actual
      const getUsersUseCase = usersContainer.getGetUsersUseCase()
      const allUsers = await getUsersUseCase.execute()

      // Filtrar por cuenta actual
      if (account) {
        return allUsers.filter(user => user.accountId === account.id)
      }

      return allUsers
    },
    enabled: Boolean(account),
  })
}

export function useUser(id: number | undefined): UseQueryResult<User | null> {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      // Obtener el use case en cada fetch para usar el repositorio actual
      const getUserUseCase = usersContainer.getGetUserUseCase()
      return await getUserUseCase.execute(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateUser(): UseMutationResult<User, Error, CreateUserDto> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (user: CreateUserDto) => {
      if (!account) {
        throw new Error('Debes iniciar sesión para crear un usuario')
      }

      // Obtener el use case en cada mutación para usar el repositorio actual
      const createUserUseCase = usersContainer.getCreateUserUseCase()
      return await createUserUseCase.execute({
        ...user,
        accountId: account.id,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`)
    },
  })
}

export function useUpdateUser(): UseMutationResult<User, Error, UpdateUserDto> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (user: UpdateUserDto) => {
      if (!account) {
        throw new Error('Debes iniciar sesión para actualizar un usuario')
      }

      // Obtener el use case en cada mutación para usar el repositorio actual
      const updateUserUseCase = usersContainer.getUpdateUserUseCase()
      return await updateUserUseCase.execute({
        ...user,
        accountId: account.id,
      })
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      void queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      toast.success('User updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`)
    },
  })
}

export function useDeleteUser(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      // Obtener el use case en cada mutación para usar el repositorio actual
      const deleteUserUseCase = usersContainer.getDeleteUserUseCase()
      await deleteUserUseCase.execute(id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`)
    },
  })
}

export function useClearAllUsers(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Debes iniciar sesión para eliminar usuarios')
      }

      const clearAllUsersUseCase = usersContainer.getClearAllUsersUseCase()
      await clearAllUsersUseCase.execute(account.id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Todos los usuarios de esta cuenta han sido eliminados!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar usuarios: ${error.message}`)
    },
  })
}
