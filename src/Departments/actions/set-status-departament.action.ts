import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Department } from "../interfaces/department.interface";

interface ChangeStatusOptions {
  id: string;
  status: boolean;
}

export const setStatusDepartmentAction = async ({ id, status }: ChangeStatusOptions): Promise<Department> => {
  const { data } = await soporteTecnicoApi.patch<Department>(`/departments/change/${id}`, { status });
  return data;
};