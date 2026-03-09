import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { DepartmentResponse } from "../interfaces/department";

export const getDepartmentsActions = async(): Promise<DepartmentResponse> => {
  const { data } = await soporteTecnicoApi.get<DepartmentResponse>('/departments');
  return data;
}