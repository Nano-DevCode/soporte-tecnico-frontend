import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Department } from "../interfaces/department.interface";

export interface UpdateDepartmentDTO {
  name?: string;
  acronym?: string;
  priority?: number;
  folio?: number;
}

export const departamentUpdateAction = async (id: string, department: UpdateDepartmentDTO): Promise<Department> => {
  const { data } = await soporteTecnicoApi.patch<Department>(`/departments/${id}`, department);
  return data;
};