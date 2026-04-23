import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { MaintenanceType } from "../interfaces/maintenance-type.interface";


export const getMaintenanceTypesAction = async (): Promise<MaintenanceType[]> => {
    const { data } = await soporteTecnicoApi.get<MaintenanceType[]>('/maintenance-type');
    return data;
}