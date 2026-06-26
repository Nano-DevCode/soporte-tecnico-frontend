export const responsesQueryKeys = {
    all: ['responses'] as const,
    lists: () => [...responsesQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...responsesQueryKeys.lists(), filters] as const,

    details: () => [...responsesQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...responsesQueryKeys.details(), id] as const,

    byTicket: (ticketId: string) => [...responsesQueryKeys.all, 'by-ticket', ticketId] as const,
};