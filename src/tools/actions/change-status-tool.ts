import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Tools } from "../interfaces/toolsResponse";

interface ChangeStatusOptions {
  id: string;
  status: boolean;
}

export const changeStatusToolAction = async ({ id, status }: ChangeStatusOptions): Promise<Tools> => {
    const { data } = await soporteTecnicoApi.patch<Tools>(`/tools/change-status/${id}`, { status });
    return data;
};