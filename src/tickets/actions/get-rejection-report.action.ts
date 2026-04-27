import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { RejectionReport } from "../interfaces/rejection-report.interface";


export const getRejectReportAction = async (id: string): Promise<RejectionReport> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<RejectionReport>(`/tickets/${id}/rejection-report`);

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};