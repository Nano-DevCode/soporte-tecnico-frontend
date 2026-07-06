import { useQuery } from "@tanstack/react-query";
import { getToolsStatusAction } from "../actions/get-tools-status";
// import type { ToolsStatus } from "../interfaces/toolsStatusResponse.interface";

export const useToolsStatus = () => {
  const {
    data: queryData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['tools-status'],
    queryFn: () => getToolsStatusAction(),
    staleTime: 1000 * 60 * 5,
    select: (response) => ({
      toolsStatus: response.toolsStatus,
    }),
  });

  return {
    // Retornamos tanto 'toolsStatus' como 'toolStatus' para máxima compatibilidad
    toolsStatus: queryData?.toolsStatus ?? [],
    toolStatus: queryData?.toolsStatus ?? [], 
    isLoading,
    isFetching,
    error,
    refetch,
  };
};