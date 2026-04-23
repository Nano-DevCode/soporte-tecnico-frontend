import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { SchoolPeriod } from "../interfaces/school-period.interface";

export const activateSchoolPeriodAction = async (id: string): Promise<SchoolPeriod> => {
    const { data } = await soporteTecnicoApi.patch<SchoolPeriod>(`/school-periods/${id}/activate`);
    return {
        ...data,
        date_start: new Date(data.date_start),
        date_end: new Date(data.date_end),
    };
};

export const deactivateSchoolPeriodAction = async (id: string): Promise<SchoolPeriod> => {
    const { data } = await soporteTecnicoApi.patch<SchoolPeriod>(`/school-periods/${id}/deactivate`);
    return {
        ...data,
        date_start: new Date(data.date_start),
        date_end: new Date(data.date_end),
    };
};