export const serviceTypesQueryKeys = {
    all: ['service-types'] as const,
    lists: () => [...serviceTypesQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...serviceTypesQueryKeys.lists(), filters] as const,

    details: () => [...serviceTypesQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...serviceTypesQueryKeys.details(), id] as const,
};