export const foliosQueryKeys = {
    all: ['ticket-folios'] as const,
    lists: () => [...foliosQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...foliosQueryKeys.lists(), filters] as const,

    details: () => [...foliosQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...foliosQueryKeys.details(), id] as const,
};
export const responseFoliosQueryKeys = {
    all: ['response-folios'] as const,
    lists: () => [...responseFoliosQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...responseFoliosQueryKeys.lists(), filters] as const,

    details: () => [...responseFoliosQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...responseFoliosQueryKeys.details(), id] as const,
};