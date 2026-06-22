import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ToolsInvoicesResponse } from "../interfaces/toolsInvoicesResponse.interface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getToolsInvoicesAction = async(options: Options):Promise<ToolsInvoicesResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ToolsInvoicesResponse>('/tools-invoices', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}