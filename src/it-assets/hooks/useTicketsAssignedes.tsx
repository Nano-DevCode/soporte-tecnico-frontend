import { useQuery } from "@tanstack/react-query"
import { getTicketsAssignedesAction } from "../actions/get-tickets-asigned"
// Asegúrate de importar tu action correcta aquí:

export const useTicketsAssignedes = () => {
    const query = useQuery({
        queryKey: ['tickets-assignedes'],
        queryFn: () => getTicketsAssignedesAction(),
        staleTime: 1000 * 60 * 5,
    })

    return {
        // Cambiamos el nombre de la variable a "tickets" para que tenga sentido
        tickets: query.data ?? [], 
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    }
}