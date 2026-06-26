import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { FaultValidity } from "../interfaces/fault-validity.interface";


export const getFaultValiditiesAction = async (): Promise<FaultValidity[]> => {
    const { data } = await soporteTecnicoApi.get<FaultValidity[]>('/fault-validities');
    return data;
}