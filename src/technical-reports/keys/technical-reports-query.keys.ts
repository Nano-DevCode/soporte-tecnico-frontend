export const technicalReportsQueryKeys = {
    all: ['technical-reports'] as const,
    lists: () => [...technicalReportsQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...technicalReportsQueryKeys.lists(), filters] as const,

    details: () => [...technicalReportsQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...technicalReportsQueryKeys.details(), id] as const,
};