import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { SchoolPeriod } from "../interfaces/school-period.interface";


export const getSchoolPeriodByIdAction = async (id: string): Promise<SchoolPeriod> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<SchoolPeriod>(`/school-periods/${id}`);

    return {
        ...data,
        date_start: new Date(data.date_start),
        date_end: new Date(data.date_end),
    }
};