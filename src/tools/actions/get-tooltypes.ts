import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ToolTypesResponse } from "../interfaces/toolTypesResponse";

interface Options {
  limit?: number | string;
  offset?: number | string;
  query?: string;
}

export const getToolTypesActions = async(options: Options):Promise<ToolTypesResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;
    const { data } = await soporteTecnicoApi.get<ToolTypesResponse>('/tool-types', {
        params: {
            limit,
            offset,
            query: query ? query.trim() : undefined
        }
    })
    return data;
}