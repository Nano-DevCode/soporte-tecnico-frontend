export const tagsQueryKeys = {
    all: ['tags'] as const,
    lists: () => [...tagsQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...tagsQueryKeys.lists(), filters] as const,

    details: () => [...tagsQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...tagsQueryKeys.details(), id] as const,
};


export const tagsInfinitQueryKeys = {
    all: ['tagsInfinit'] as const,
    lists: () => [...tagsInfinitQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...tagsInfinitQueryKeys.lists(), filters] as const,

    details: () => [...tagsInfinitQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...tagsInfinitQueryKeys.details(), id] as const,
};