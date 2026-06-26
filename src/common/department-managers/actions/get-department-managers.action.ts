import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { DepartmentManager } from "../interfaces/department-manager.interface";


export const getDepartmentManagersAction = async (): Promise<DepartmentManager[]> => {
    const { data } = await soporteTecnicoApi.get<DepartmentManager[]>('/staff/department-managers');
    return data;
}