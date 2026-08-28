import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import type { TechnicianKpiResponse } from "../interfaces/technicianKpi.response";
import { getTechniciansResolutionAction } from '../actions/get-techniciansResolution.action';

export const useTechniciansResolution = () => {
  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;
  const query = searchParams.get("search")?.trim() || undefined; 
  const minAssigned = searchParams.get("minAssigned") || undefined;
  const performanceStatus = searchParams.get("performanceStatus") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const order = searchParams.get("order") || undefined;

  const queryOptions = {
    limit,
    offset,
    query,
    minAssigned,
    performanceStatus,
    sortBy,
    order
  };

  const { 
    data, 
    isLoading, 
    isFetching, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['technicians-resolution', queryOptions],
    queryFn: () => getTechniciansResolutionAction(queryOptions),
    staleTime: 1000 * 60 * 5,
    select: (response: TechnicianKpiResponse) => ({
      staffs: response.staffs, 
      meta: response.meta,
    }),
  });

  return {
    staffs: data?.staffs ?? [],
    meta: data?.meta,
    
    isLoading,
    isFetching,
    error,
    refetch,
  };
};