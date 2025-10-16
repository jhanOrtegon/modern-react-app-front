export const postQueryKeys = {
  all: ['posts'] as const,

  lists: () => [...postQueryKeys.all, 'list'] as const,

  list: (accountId: number) => [...postQueryKeys.lists(), accountId] as const,

  details: () => [...postQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...postQueryKeys.details(), id] as const,
}
