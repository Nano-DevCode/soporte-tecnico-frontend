import { useQuery } from "@tanstack/react-query"
import { getCoordinationsActions } from "../actions/get-coordination.action";

export const useCoordinations = () => {
    return useQuery({
        queryKey: ['coordinations'],
        queryFn: async() => getCoordinationsActions(),
        staleTime: 1000 * 60 * 5,
    });
}