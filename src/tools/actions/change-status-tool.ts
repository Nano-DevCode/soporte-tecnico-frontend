import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Tool } from "../interfaces/toolsResponse";

interface ChangeStatusOptions {
  id: string;
  status: boolean;
}

export const changeStatusToolAction = async ({ id, status }: ChangeStatusOptions): Promise<Tool> => {
    const { data } = await soporteTecnicoApi.patch<Tool>(`/tools/change-status/${id}`, { status });
    return data;
};