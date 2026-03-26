import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { DepartmentResponse } from "../interfaces/department.interface";

interface Options {
  limit?: number | string;
  offset?: number | string;
  status?: string;
  query?: string;
}

export const getDepartmentsActions = async(options: Options):Promise<DepartmentResponse> => {
  const { limit = 10, offset = 0, status = undefined, query = undefined } = options;
  const statusValue = status === 'true' 
    ? true 
    : status === 'false' 
      ? false 
      : undefined;
  const { data } = await soporteTecnicoApi.get<DepartmentResponse>('/departments/filter',
    {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        status: statusValue,
        query: query ? query.trim().replaceAll('+', ' ') : undefined,
      },
    }
  );  
  return data;
}