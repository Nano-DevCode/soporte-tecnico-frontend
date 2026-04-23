export const maintenanceTypesQueryKeys = {
    all: ['maintenance-types'] as const,
    lists: () => [...maintenanceTypesQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...maintenanceTypesQueryKeys.lists(), filters] as const,

    details: () => [...maintenanceTypesQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...maintenanceTypesQueryKeys.details(), id] as const,
};