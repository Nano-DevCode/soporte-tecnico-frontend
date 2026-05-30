import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Status } from "../interface/get-status.response";

export const getStatusAction = async (): Promise<Status[]> => {
    const { data } = await soporteTecnicoApi.get<Status[]>('/status');
    return data;
}