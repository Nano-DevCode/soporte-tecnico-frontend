export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    lists: () => [...dashboardQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...dashboardQueryKeys.lists(), filters] as const,

    details: () => [...dashboardQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...dashboardQueryKeys.details(), id] as const,
};