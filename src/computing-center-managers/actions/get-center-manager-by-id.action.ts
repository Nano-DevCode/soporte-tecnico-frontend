import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CenterManager } from "../interfaces/center-manager.interface";


export const getCenterManagerByIdAction = async (id: string): Promise<CenterManager> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<CenterManager>(`/computing-center-manager/${id}`);

    return data;
};