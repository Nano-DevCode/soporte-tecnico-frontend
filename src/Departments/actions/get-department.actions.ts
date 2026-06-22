import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Department } from "../interfaces/department.interface";

export const getDepartmentByIdAction = async (id: string): Promise<Department> => {
  const { data } = await soporteTecnicoApi.get<Department>(`/departments/${id}`);
  return data;
}