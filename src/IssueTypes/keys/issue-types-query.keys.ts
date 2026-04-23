export const IssueTypesQueryKeys = {
    all: ['issue-types'] as const,
    lists: () => [...IssueTypesQueryKeys.all, 'list'] as const,

    list: (filters: Record<string, unknown>) => [...IssueTypesQueryKeys.lists(), filters] as const,

    details: () => [...IssueTypesQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...IssueTypesQueryKeys.details(), id] as const,
};