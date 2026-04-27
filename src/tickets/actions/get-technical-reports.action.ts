import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TechnicalReport } from "../interfaces/technical-report.interface";


export const getTechnicalReportsAction = async (id: string): Promise<TechnicalReport[]> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<TechnicalReport[]>(`/tickets/${id}/technical-reports`);

    return data.map((tr) => ({
        ...tr,
        created_at: new Date(tr.created_at),
        updated_at: new Date(tr.updated_at),
    }))
};