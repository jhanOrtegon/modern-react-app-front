import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { accountsContainer } from '../../di/AccountsContainer'
import type {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
} from '../../domain/entities/Account'

export function useAccounts(): UseQueryResult<Account[]> {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const getAccountsUseCase = accountsContainer.getGetAccountsUseCase()
      return await getAccountsUseCase.execute()
    },
  })
}

export function useAccount(
  id: number | undefined
): UseQueryResult<Account | null> {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      const getAccountUseCase = accountsContainer.getGetAccountUseCase()
      return await getAccountUseCase.execute(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateAccount(): UseMutationResult<
  Account,
  Error,
  CreateAccountDto
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (account: CreateAccountDto) => {
      const createAccountUseCase = accountsContainer.getCreateAccountUseCase()
      return await createAccountUseCase.execute(account)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta creada exitosamente!')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear cuenta: ${error.message}`)
    },
  })
}

export function useUpdateAccount(): UseMutationResult<
  Account,
  Error,
  UpdateAccountDto
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (account: UpdateAccountDto) => {
      const updateAccountUseCase = accountsContainer.getUpdateAccountUseCase()
      return await updateAccountUseCase.execute(account)
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
      void queryClient.invalidateQueries({
        queryKey: ['account', variables.id],
      })
      toast.success('Cuenta actualizada exitosamente!')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar cuenta: ${error.message}`)
    },
  })
}

export function useDeleteAccount(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const deleteAccountUseCase = accountsContainer.getDeleteAccountUseCase()
      await deleteAccountUseCase.execute(id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta eliminada exitosamente!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar cuenta: ${error.message}`)
    },
  })
}

export function useClearAllAccounts(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const clearAllAccountsUseCase =
        accountsContainer.getClearAllAccountsUseCase()
      await clearAllAccountsUseCase.execute()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Todas las cuentas han sido eliminadas!')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar cuentas: ${error.message}`)
    },
  })
}
