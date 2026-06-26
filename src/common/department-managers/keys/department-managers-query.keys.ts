export const departmentManagersQueryKeys = {
    all: ['department-managers'] as const,
    lists: () => [...departmentManagersQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...departmentManagersQueryKeys.lists(), filters] as const,

    details: () => [...departmentManagersQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...departmentManagersQueryKeys.details(), id] as const,
};