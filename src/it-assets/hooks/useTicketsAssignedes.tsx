import { useQuery } from "@tanstack/react-query"
import { getTicketsAssignedesAction } from "../actions/get-tickets-asigned"

export const useTicketsAssignedes = () => {
    const {
        data: tickets,
        isLoading,
        isFetching,
        error,
        refetch
    } = useQuery({
        queryKey: ['tickets-assignedes'],
        queryFn: () => getTicketsAssignedesAction(),
        staleTime: 1000 * 60 * 5,
    })

    return {
        tickets: tickets ?? [], 
        isLoading,
        isFetching,
        error,
        refetch,
    }
}