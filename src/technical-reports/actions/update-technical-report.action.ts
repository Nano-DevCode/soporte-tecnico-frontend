import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { UpdateTechnicalReportPayload, UpdateTechnicalReportResponse } from "../interfaces/update-technical-report";

export interface Props {
    reportId: string
    updateTechnicalReportPayload: UpdateTechnicalReportPayload
}

export const updateTechnicalReportAction = async (
    { reportId, updateTechnicalReportPayload }: Props
): Promise<UpdateTechnicalReportResponse> => {

    const { data } = await soporteTecnicoApi.patch<UpdateTechnicalReportResponse>(
        `/technical-reports/${reportId}`,
        updateTechnicalReportPayload
    );

    return data
};