export const ticketsQueryKeys = {
    all: ['tickets'] as const,
    lists: () => [...ticketsQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...ticketsQueryKeys.lists(), filters] as const,

    details: () => [...ticketsQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...ticketsQueryKeys.details(), id] as const,
};