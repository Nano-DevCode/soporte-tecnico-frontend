import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { TechnicianKpiResponse } from "../interfaces/technicianKpi.response";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
  minAssigned?: number | string;
  performanceStatus?: string;
  sortBy?: string;
  order?: string;
}

export const getTechniciansResolutionAction = async (options: Options): Promise<TechnicianKpiResponse> => {
  const { 
    limit = 10, 
    offset = 0, 
    query = undefined,
    minAssigned,
    performanceStatus,
    sortBy,
    order
  } = options;

  const { data } = await soporteTecnicoApi.get<TechnicianKpiResponse>('/staff/technicians-kpis',
    {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        query: query ? query.replaceAll('+', ' ').trim() : undefined,
        minAssigned: minAssigned ? Number(minAssigned) : undefined,
        performanceStatus: performanceStatus || undefined,
        sortBy: sortBy || undefined,
        order: order || undefined,
      },
    }
  );  
  
  return data;
}