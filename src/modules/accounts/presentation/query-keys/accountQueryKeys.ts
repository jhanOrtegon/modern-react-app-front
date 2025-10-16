export const accountQueryKeys = {
  all: ['accounts'] as const,

  lists: () => [...accountQueryKeys.all, 'list'] as const,

  details: () => [...accountQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...accountQueryKeys.details(), id] as const,
}
