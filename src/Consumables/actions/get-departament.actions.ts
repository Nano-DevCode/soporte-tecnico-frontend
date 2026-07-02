import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";

export interface DepartmentResponse {
    data: Department[];
    meta: Meta;
}
export type DepartmentResponseAll = Department[];

export interface Department {
    id: string;
    name: string;
    priority: number;
    status?: boolean;
    folio: string;
    acronym: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Meta {
    total: number;
    page: number;
    lastPage: number;
}
interface Options {
    limit?: number | string;
    offset?: number | string;
    status?: string;
    query?: string;
}

export const getDepartmentsActions = async (options: Options): Promise<DepartmentResponse> => {
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

export const getDepartmentByIdAction = async (id: string): Promise<Department | null> => {
    try {
        const { data } = await soporteTecnicoApi.get<Department>(`/departments/${id}`);
        return data;
    } catch  {
        //console.error(`${t("api_departments_by_id_error")} ${id}:`, error);
        return null;
    }
};