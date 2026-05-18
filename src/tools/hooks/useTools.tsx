import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from "react-router";

// Importaciones de tus actions
import { getToolsActions } from '../actions/get-tools';
import { changeStatusToolAction } from '../actions/change-status-tool';
import { createToolsActions } from '../actions/create-tools';
import { updateToolsActions } from '../actions/update-tools';
import { getOneToolActions } from '../actions/get-tool';
import { getToolsByIdsAction } from '../actions/post-toolsById';

// Agregamos bagIds como parámetro opcional con un arreglo vacío por defecto
export const useTools = (bagIds: string[] = []) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { id } = useParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const status = searchParams.get('status') || undefined; 
  const query = searchParams.get("query")?.trim() || undefined; 
  
  const brandId = searchParams.get("brandId")?.trim() || undefined; 
  const typeId = searchParams.get("typeId")?.trim() || undefined; 
  const haveInternalId = searchParams.get("haveInternalId")?.trim() || undefined;

  const toolsQuery = useQuery({
    queryKey: ['tools', { limit, offset, status, query, brandId, typeId, haveInternalId }],
    queryFn: () => getToolsActions({ limit, offset, status, query, brandId, typeId, haveInternalId }),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      tools: response.tools,
      meta: response.meta,
    }),
  });

  const getOneQuery = useQuery({
    queryKey: ['tool', id], 
    queryFn: () => getOneToolActions({ id: id! }),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  const getByIdsQuery = useQuery({
    queryKey: ['tools', 'bag', bagIds], 
    queryFn: () => getToolsByIdsAction({ ids: bagIds }),
    staleTime: 1000 * 60 * 5, // Mantiene la caché por 5 minutos
    enabled: bagIds.length > 0,
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeStatusToolAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
    onError: (error) => {
      console.error("Error al cambiar el estado de la herramienta:", error);
    }
  });

  const createToolMutation = useMutation({
    mutationFn: createToolsActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
    onError: (error) => {
      console.error("Error al guardar la Herramienta:", error);
    }
  });

  const updateToolMutation = useMutation({
    mutationFn: updateToolsActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['tool', id] });
      }
      queryClient.invalidateQueries({ queryKey: ['tools', 'bag'] });
    },
    onError: (error) => {
      console.error("Error al guardar la Herramienta:", error);
    }
  });
  
  return {
    // Datos Catálogo
    tools: toolsQuery.data?.tools ?? [],
    meta: toolsQuery.data?.meta,
    isLoading: toolsQuery.isLoading,
    isFetching: toolsQuery.isFetching,
    error: toolsQuery.error,
    refetch: toolsQuery.refetch,

    // Dato Individual
    tool: getOneQuery.data,
    toolLoading: getOneQuery.isLoading,

    // NUEVO: Datos de la Bolsa
    bagTools: getByIdsQuery.data ?? [],
    isBagLoading: getByIdsQuery.isLoading,
    isBagFetching: getByIdsQuery.isFetching,

    // Crear Herramienta
    createToolAsync: createToolMutation.mutateAsync,
    isCreating: createToolMutation.isPending,
    createError: createToolMutation.error,

    // Update Herramienta
    updateToolAsync: updateToolMutation.mutateAsync,
    isUpdating: updateToolMutation.isPending,
    updateError: updateToolMutation.error,

    // Cambiar Estado
    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,
    changeStatusError: changeStatusMutation.error,
  };
};