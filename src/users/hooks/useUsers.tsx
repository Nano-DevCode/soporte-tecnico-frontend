import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getUsersActions } from "../actions/get-users.action";
import { setStatusUserAction } from "../actions/set-status-user.action";
import type { UserResponse } from "../interfaces/users.response";

export const useUsers = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  
  const departmentId = searchParams.get('dept') || undefined;
  const query = searchParams.get("search")?.trim() || undefined; 

  const status = searchParams.get('status') || undefined;
  const { 
    data, 
    isLoading, 
    isFetching, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['users', { limit, offset, departmentId, status, query }],
    queryFn: () => getUsersActions({ limit, offset, departmentId, status, query }),
    staleTime: 1000 * 60 * 5,
    select: (response: UserResponse) => ({
      users: response.users, 
      meta: response.meta,
    }),
  });

  // 3. Mutación para cambiar el estado (Alta/Baja)
  const statusMutation = useMutation({
    mutationFn: setStatusUserAction,
    onSuccess: () => {
      // Invalidamos la cache para que la tabla se refresque automáticamente
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error("Error al cambiar el estado del usuario:", error);
    }
  });

  return {
    // Datos procesados
    users: data?.users ?? [],
    meta: data?.meta,
    
    // Estados de carga
    isLoading,
    isFetching,
    error,
    refetch,

    // Acciones de mutación
    changeStatus: statusMutation.mutateAsync,
    isUpdating: statusMutation.isPending,
  };
};