import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { DepartmentResponseAll } from "@/Departments/interfaces/department.interface";

export const getDepartmentsActions = async(): Promise<DepartmentResponseAll> => {
  const { data } = await soporteTecnicoApi.get<DepartmentResponseAll>('/departments');
  return data;
}