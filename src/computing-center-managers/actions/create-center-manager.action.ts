import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CenterManager, CreateCenterManagerPayload } from "../interfaces/center-manager.interface";

export const createCenterManagerAction = async (
    centerManagerPayload: CreateCenterManagerPayload
): Promise<CenterManager> => {

    const { data } = await soporteTecnicoApi.post<CenterManager>(
        '/computing-center-manager',
        centerManagerPayload
    );

    return {
        ...data,
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
        updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
    };
};