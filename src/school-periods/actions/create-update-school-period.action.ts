import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { SchoolPeriod } from "../interfaces/school-period.interface";
// import { sleep } from "@/lib/sleep"


export const createUpdateSchoolPeriodAction = async (
  schoolPeriodLike: Partial<SchoolPeriod>
): Promise<SchoolPeriod> => {
  // await sleep(1500);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, is_active, ...rest } = schoolPeriodLike;

  const isCreating = !id || id === 'new';

  const { data } = await soporteTecnicoApi<SchoolPeriod>({
    url: isCreating ? '/school-periods' : `/school-periods/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: rest,
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
