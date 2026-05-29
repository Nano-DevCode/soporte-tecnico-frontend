import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ListTechnicalReports } from "../interfaces/list-technical-reports.interface";

interface Options {
    limit?: number | string;
    page?: number | string;
    query?: string;
}

export const getAllTechnicalReports = async (options: Options): Promise<ListTechnicalReports> => {
    const { limit = 10, page = 1, query } = options;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const { data } = await soporteTecnicoApi.get<ListTechnicalReports>('/technical-reports',
        {
            params: {
                limit: isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit,
                page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
                search: query,
            },
        }
    );
    return data;
}