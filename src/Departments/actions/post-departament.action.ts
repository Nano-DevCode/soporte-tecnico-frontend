import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"; // Ajusta el import a tu instancia de Axios
import type { Department } from "../interfaces/department.interface";

export interface CreateDepartmentDTO {
  name: string;
  acronym: string;
  priority: number;
}

export const createDepartmentAction = async (department: CreateDepartmentDTO): Promise<Department> => {
  const { data } = await soporteTecnicoApi.post<Department>('/departments', department);
  return data;
};