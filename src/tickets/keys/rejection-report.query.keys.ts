export const rejectionReportQueryKeys = {
    all: ['rejection-report'] as const,
    lists: () => [...rejectionReportQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...rejectionReportQueryKeys.lists(), filters] as const,

    details: () => [...rejectionReportQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...rejectionReportQueryKeys.details(), id] as const,
};