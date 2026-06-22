import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";
import { logError } from "@/utils/logger";

export const logoutAction = async(): Promise<AuthResponse> => {
    try {
      const { data } = await soporteTecnicoApi.post<AuthResponse>('/auth/logout');
      return data;
    } catch (error) {
      logError(error, "logoutAction");
      throw error;
    }
}