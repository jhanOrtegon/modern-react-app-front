import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersContainer } from '../../di/UsersContainer'
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'

export function useUsers(): UseQueryResult<User[]> {
  const getUsersUseCase = usersContainer.getGetUsersUseCase()

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => await getUsersUseCase.execute(),
  })
}

export function useUser(id: number | undefined): UseQueryResult<User | null> {
  const getUserUseCase = usersContainer.getGetUserUseCase()

  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      return await getUserUseCase.execute(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateUser(): UseMutationResult<User, Error, CreateUserDto> {
  const createUserUseCase = usersContainer.getCreateUserUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: CreateUserDto) =>
      await createUserUseCase.execute(user),
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
  const updateUserUseCase = usersContainer.getUpdateUserUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UpdateUserDto) =>
      await updateUserUseCase.execute(user),
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
  const deleteUserUseCase = usersContainer.getDeleteUserUseCase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
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
