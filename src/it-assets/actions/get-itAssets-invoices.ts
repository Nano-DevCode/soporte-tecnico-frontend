import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItAssetsInvoicesResponse } from "../interfaces/itAssetsInvoicesResponse.interface";

interface Options {
  offset?: number | string;
  limit?: number | string;
  query?: string;
}

export const getItAssetsInvoicesAction = async(options: Options):Promise<ItAssetsInvoicesResponse> => {
  const { limit = 10, offset = 0, query = undefined } = options;
  const { data } = await soporteTecnicoApi.get<ItAssetsInvoicesResponse>('/it-assets-invoices', {
    params: {
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      query: query ? query : undefined,
    }
  });  
  return data;
}