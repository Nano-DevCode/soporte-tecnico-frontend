import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { DepartmentResponseAll } from "@/departments/interfaces/department.interface";

export const getDepartmentsActions = async(): Promise<DepartmentResponseAll> => {
  const { data } = await soporteTecnicoApi.get<DepartmentResponseAll>('/departments');
  return data;
}