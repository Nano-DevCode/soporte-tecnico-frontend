import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CenterManager, CreateCenterManagerPayload } from "../interfaces/center-manager.interface";

export interface UpdateCenterManagerVariables {
    id: string;
    payload: Partial<CreateCenterManagerPayload>;
}

export const updateCenterManagerAction = async (
    { id, payload }: UpdateCenterManagerVariables
): Promise<CenterManager> => {

    const { data } = await soporteTecnicoApi.patch<CenterManager>(
        `/computing-center-manager/${id}`,
        payload
    );

    return {
        ...data,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
    };
};