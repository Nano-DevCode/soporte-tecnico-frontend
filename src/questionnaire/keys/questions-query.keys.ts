export const questionQueryKeys = {
    all: ['questions'] as const,
    lists: () => [...questionQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...questionQueryKeys.lists(), filters] as const,

    active: () => [...questionQueryKeys.lists(), 'active'] as const,

    details: () => [...questionQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...questionQueryKeys.details(), id] as const,
};