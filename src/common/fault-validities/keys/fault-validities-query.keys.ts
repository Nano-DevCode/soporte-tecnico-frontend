export const faultValiditiesQueryKeys = {
    all: ['fault-validities'] as const,
    lists: () => [...faultValiditiesQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...faultValiditiesQueryKeys.lists(), filters] as const,

    details: () => [...faultValiditiesQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...faultValiditiesQueryKeys.details(), id] as const,
};