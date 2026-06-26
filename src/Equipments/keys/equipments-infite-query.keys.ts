export const equipmentsInfinitQueryKeys = {
    all: ['equipmentsInfinit'] as const,
    lists: () => [...equipmentsInfinitQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...equipmentsInfinitQueryKeys.lists(), filters] as const,

    details: () => [...equipmentsInfinitQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...equipmentsInfinitQueryKeys.details(), id] as const,
};