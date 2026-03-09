import { useQuery } from "@tanstack/react-query"
import { getDepartmentsActions } from "../actions/get-department";

export const useDepartments = () => {
    return useQuery({
        queryKey: ['depatments'],
        queryFn: async() => getDepartmentsActions(),
        staleTime: 1000 * 60 * 5,
    });
}