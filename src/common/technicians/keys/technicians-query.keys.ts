export const techniciansQueryKeys = {
    all: ['technicians'] as const,
    lists: () => [...techniciansQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...techniciansQueryKeys.lists(), filters] as const,

    details: () => [...techniciansQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...techniciansQueryKeys.details(), id] as const,
};