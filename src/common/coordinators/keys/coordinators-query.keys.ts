export const coordinatorsQueryKeys = {
    all: ['coordinators'] as const,
    lists: () => [...coordinatorsQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...coordinatorsQueryKeys.lists(), filters] as const,

    details: () => [...coordinatorsQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...coordinatorsQueryKeys.details(), id] as const,
};