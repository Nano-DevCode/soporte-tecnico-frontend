import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { UserResponse } from "../interfaces/users.response";

interface Options {
  limit?: number | string;
  offset?: number | string;
  departmentId?: string;
  status?: string;
  query?: string;
}

export const getUsersActions = async(options: Options):Promise<UserResponse> => {
  const { limit = 10, offset = 0, departmentId = undefined, status = undefined, query = undefined } = options;
  const statusValue = status === '1' 
    ? true 
    : status === '0' 
      ? false 
      : undefined;
  const { data } = await soporteTecnicoApi.get<UserResponse>('/users',
    {
      params: {
        limit: isNaN(Number(limit)) ? 10 : Number(limit),
        offset: isNaN(Number(offset)) ? 0 : Number(offset),
        departmentId: departmentId === 'all' ? undefined : departmentId,
        status: status === 'all' ? undefined : statusValue,
        query: query?.replaceAll('+', ' ')
      },
    }
  );  
  return data;
}