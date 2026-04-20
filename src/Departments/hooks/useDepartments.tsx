import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from "react-router";
import { getDepartmentsActions } from "../actions/get-departments.action";
import { setStatusDepartmentAction } from "../actions/set-status-departament.action";

export const useDepartments = () => {

  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const status = searchParams.get('status') || undefined; 
  const query = searchParams.get("search")?.trim() || undefined; 

  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ['departments', { limit, offset, status, query }],
    queryFn: () => getDepartmentsActions({ limit, offset, status, query }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      departments: response.data,
      meta: response.meta,
    }),
  });

  const statusMutation = useMutation({
    mutationFn: setStatusDepartmentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error) => {
      console.error("Error en la mutación:", error);
    }
  });

  return {
    // Datos procesados
    departments: departmentsQuery.data?.departments ?? [],
    meta: departmentsQuery.data?.meta,

    // Estados de carga
    isLoading: departmentsQuery.isLoading,
    isFetching: departmentsQuery.isFetching,
    error: departmentsQuery.error,
    refetch: departmentsQuery.refetch,

    // Acciones de mutación
    changeStatus: statusMutation.mutateAsync,
    isUpdating: statusMutation.isPending,
  };
};