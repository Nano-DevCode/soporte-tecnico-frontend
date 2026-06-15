import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { StaffsWithSpecificsRolesResponse } from "../../it-assets/interfaces/staffsWithSpecificsRolesResponse.interface";

interface Options {
  query?: string;
  limit?: number | string;
  offset?: number | string;
}


export const getStaffRoleSpecificAction = async(options: Options): Promise<StaffsWithSpecificsRolesResponse> => {
  const { query = undefined, limit = 10, offset = 0 } = options;
  const { data } = await soporteTecnicoApi.get<StaffsWithSpecificsRolesResponse>(`/staff/roleSpecific`,{
    params: {
      query: query ? query : undefined,
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
    }
  });  
  
  return data;
}