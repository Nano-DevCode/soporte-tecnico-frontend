export const centerManagerQueryKeys = {
    all: ['centerManager'] as const,
    lists: () => [...centerManagerQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...centerManagerQueryKeys.lists(), filters] as const,

    details: () => [...centerManagerQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...centerManagerQueryKeys.details(), id] as const,
};