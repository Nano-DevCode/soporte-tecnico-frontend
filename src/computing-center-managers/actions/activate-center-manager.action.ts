import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CenterManager } from "../interfaces/center-manager.interface";

export const activateCenterManagerAction = async (id: string): Promise<CenterManager> => {
    const { data } = await soporteTecnicoApi.patch<CenterManager>(`/computing-center-manager/${id}/activate`);
    return {
        ...data,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
    };
};