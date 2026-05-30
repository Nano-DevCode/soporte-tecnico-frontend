export const statusQueryKeys = {
    all: ['status'] as const,
    lists: () => [...statusQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...statusQueryKeys.lists(), filters] as const,

    details: () => [...statusQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...statusQueryKeys.details(), id] as const,
};