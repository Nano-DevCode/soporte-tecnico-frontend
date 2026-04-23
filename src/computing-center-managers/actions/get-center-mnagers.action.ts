import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { CenterManagersResponse } from "@/computing-center-managers/interfaces/center-manager-response";

interface Options {
  limit?: number | string;
  page?: number | string;
  query?: string;
  status?: boolean;
}
// TODO: AGREGAR STATUS

export const getCenterManagersAction = async (options: Options): Promise<CenterManagersResponse> => {
  const { limit = 10, page = 1, query = undefined, status = undefined } = options;
  const parsedLimit = Number(limit);
  const parsedPage = Number(page);

  const { data } = await soporteTecnicoApi.get<CenterManagersResponse>('/computing-center-manager',
    {
      params: {
        limit: isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit,
        page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
        search: query,
        is_active: status,
      },
    }
  );
  return data;
}