import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { usersContainer } from '../../di/UsersContainer'
import { userQueryKeys } from '../query-keys/userQueryKeys'

import type { CreateUserDto, UpdateUserDto } from '../../domain/dtos'
import type { User } from '../../domain/entities/User'

export function useUsers(): UseQueryResult<User[]> {
  const account = useAuthStore(state => state.account)

  return useQuery({
    queryKey: [...userQueryKeys.list(account?.id ?? 0), account],
    queryFn: async () => {
      const getUsersUseCase = usersContainer.getGetUsersUseCase()

      const allUsers = await getUsersUseCase.execute(account?.id)

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
    queryKey: userQueryKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) {
        return null
      }

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

      const createUserUseCase = usersContainer.getCreateUserUseCase()
      return await createUserUseCase.execute({
        ...user,
        accountId: account.id,
      })
    },

    onMutate: async (newUser: CreateUserDto) => {
      if (!account) {
        return
      }

      const queryKey = [...userQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      const previousUsers = queryClient.getQueryData<User[]>(queryKey)

      queryClient.setQueryData<User[]>(queryKey, old => [
        ...(old ?? []),
        {
          ...newUser,
          id: Date.now(),
          accountId: account.id,
          phone: newUser.phone,
          website: newUser.website,
          address: {
            street: 'N/A',
            suite: 'N/A',
            city: 'N/A',
            zipcode: 'N/A',
          },
          company: {
            name: 'N/A',
            catchPhrase: 'N/A',
            bs: 'N/A',
          },
        },
      ])

      return { previousUsers, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('User created successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(context.queryKey, context.previousUsers)
      }
      toast.error(`Failed to create user: ${error.message}`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
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

      const updateUserUseCase = usersContainer.getUpdateUserUseCase()
      return await updateUserUseCase.execute({
        ...user,
        accountId: account.id,
      })
    },

    onMutate: async (updatedUser: UpdateUserDto) => {
      if (!account) {
        return
      }

      const listQueryKey = [...userQueryKeys.list(account.id), account]
      const detailQueryKey = userQueryKeys.detail(updatedUser.id)

      await queryClient.cancelQueries({ queryKey: listQueryKey })
      await queryClient.cancelQueries({ queryKey: detailQueryKey })

      const previousUsersList = queryClient.getQueryData<User[]>(listQueryKey)
      const previousUser = queryClient.getQueryData<User>(detailQueryKey)

      queryClient.setQueryData<User[]>(listQueryKey, old =>
        old?.map(user =>
          user.id === updatedUser.id
            ? { ...user, ...updatedUser, accountId: account.id }
            : user
        )
      )

      queryClient.setQueryData<User>(detailQueryKey, old =>
        old ? { ...old, ...updatedUser, accountId: account.id } : old
      )

      return { previousUsersList, previousUser, listQueryKey, detailQueryKey }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.id),
      })
      toast.success('User updated successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousUsersList) {
        queryClient.setQueryData(
          context.listQueryKey,
          context.previousUsersList
        )
      }
      if (context?.previousUser) {
        queryClient.setQueryData(context.detailQueryKey, context.previousUser)
      }
      toast.error(`Failed to update user: ${error.message}`)
    },
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.id),
      })
    },
  })
}

export function useDeleteUser(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const account = useAuthStore(state => state.account)

  return useMutation({
    mutationFn: async (id: number) => {
      const deleteUserUseCase = usersContainer.getDeleteUserUseCase()
      await deleteUserUseCase.execute(id)
    },

    onMutate: async (deletedId: number) => {
      if (!account) {
        return
      }

      const queryKey = [...userQueryKeys.list(account.id), account]
      await queryClient.cancelQueries({ queryKey })

      const previousUsers = queryClient.getQueryData<User[]>(queryKey)

      queryClient.setQueryData<User[]>(queryKey, old =>
        old?.filter(user => user.id !== deletedId)
      )

      return { previousUsers, queryKey }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('User deleted successfully!')
    },
    onError: (error: Error, _, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(context.queryKey, context.previousUsers)
      }
      toast.error(`Failed to delete user: ${error.message}`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
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
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('Todos los usuarios de esta cuenta han sido eliminados!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar usuarios: ${error.message}`)
    },
  })
}
