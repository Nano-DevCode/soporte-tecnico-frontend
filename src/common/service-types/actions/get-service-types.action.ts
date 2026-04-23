import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ServiceType } from "../interfaces/service-type.interface";


export const getServiceTypesAction = async (): Promise<ServiceType[]> => {
    const { data } = await soporteTecnicoApi.get<ServiceType[]>('/service-type');
    return data;
}