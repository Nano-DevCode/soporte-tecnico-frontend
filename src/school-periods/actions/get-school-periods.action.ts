import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { SchoolPeriodsResponse } from "../interfaces/school-periods.response";

interface Options {
  limit?: number | string;
  page?: number | string;
  query?: string;
  status?: boolean;
}


export const getSchoolPeriodsAction = async (options: Options): Promise<SchoolPeriodsResponse> => {
  const { limit = 10, page = 1, query = undefined, status = undefined } = options;
  const parsedLimit = Number(limit);
  const parsedPage = Number(page);

  const { data } = await soporteTecnicoApi.get<SchoolPeriodsResponse>('/school-periods',
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