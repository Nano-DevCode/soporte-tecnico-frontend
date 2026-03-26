import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Department } from "../interfaces/department.interface";

export const getDepartmentByIdAction = async (id: string): Promise<Department> => {
  try {
    const { data } = await soporteTecnicoApi.get<Department>(`/departments/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener el departamento con id ${id}:`, error);
    throw error;
  }
}