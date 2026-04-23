import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Technician } from "../interfaces/technicians.interface";


export const getTechniciansAction = async (): Promise<Technician[]> => {
    const { data } = await soporteTecnicoApi.get<Technician[]>('/staff/technical');
    return data;
}