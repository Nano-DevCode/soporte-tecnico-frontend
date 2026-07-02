import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { SchoolPeriod } from "../interfaces/school-period.interface";
import type { SchoolPeriodFormOutput } from "../schemas/create-school-period.schema";

interface Props {
  schoolPeriodLike: SchoolPeriodFormOutput,
  periodId?: string
}
export const createUpdateSchoolPeriodAction = async (
  { periodId, schoolPeriodLike }: Props
): Promise<SchoolPeriod> => {

  const isCreating = !periodId || periodId === 'new';

  const { data } = await soporteTecnicoApi<SchoolPeriod>({
    url: isCreating ? '/school-periods' : `/school-periods/${periodId}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: schoolPeriodLike,
  }
  );
  return {
    ...data,
    date_start: new Date(data.date_start),
    date_end: new Date(data.date_end),
    created_at: data.created_at ? new Date(data.created_at) : new Date(),
    updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
  };
}
