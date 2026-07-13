import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { SchoolPeriodSimple } from "../interfaces/school-period.interface";

export const getSchoolPeriodsForSelectAction = async (): Promise<SchoolPeriodSimple[]> => {

  const { data } = await soporteTecnicoApi.get<SchoolPeriodSimple[]>('/school-periods/for-select');
  return data;
}