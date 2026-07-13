import { useQuery } from "@tanstack/react-query"
import { getDepartmentsActions } from "../actions/get-department";

interface Options {
    enabled?: boolean;
}

export const useDepartments = (options?: Options) => {
    return useQuery({
        queryKey: ['depatments'],
        queryFn: async () => getDepartmentsActions(),
        staleTime: 1000 * 60 * 5,
        enabled: options?.enabled !== undefined ? options.enabled : true,
    });
}