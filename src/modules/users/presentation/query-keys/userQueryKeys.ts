export const userQueryKeys = {
  all: ['users'] as const,

  lists: () => [...userQueryKeys.all, 'list'] as const,

  list: (accountId: number) => [...userQueryKeys.lists(), accountId] as const,

  details: () => [...userQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...userQueryKeys.details(), id] as const,
}
