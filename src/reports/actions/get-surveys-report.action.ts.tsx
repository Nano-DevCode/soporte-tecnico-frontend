import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const getSurveysReportExcelAction = async (school_period: string): Promise<Blob> => {
    if (!school_period) throw new Error("Se requiere el id del periodo escolar");

    const { data } = await soporteTecnicoApi.get<Blob>('/excel/surveys-report', {
        params: {
            school_period
        },
        responseType: 'blob',
    });

    return data;
};