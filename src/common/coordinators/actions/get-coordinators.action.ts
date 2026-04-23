import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Coordinator } from "../interfaces/get-coordinators.response";


export const getCoordinatorsAction = async (): Promise<Coordinator[]> => {
    const { data } = await soporteTecnicoApi.get<Coordinator[]>('/staff/coordinators');
    return data;
}