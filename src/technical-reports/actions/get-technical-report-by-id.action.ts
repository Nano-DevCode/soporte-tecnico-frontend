import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TechnicalReportDetails } from "../interfaces/technical-report-details.interface";


export const getTechnicalReportByIdAction = async (id: string): Promise<TechnicalReportDetails> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<TechnicalReportDetails>(`/technical-reports/${id}`);

    return data;
};