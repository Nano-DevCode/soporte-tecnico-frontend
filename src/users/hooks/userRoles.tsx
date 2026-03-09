import { useQuery } from "@tanstack/react-query"
import { getRolesActions } from "../actions/get-roles.actions";

export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async() => getRolesActions(),
        staleTime: 1000 * 60 * 5,
    });
}