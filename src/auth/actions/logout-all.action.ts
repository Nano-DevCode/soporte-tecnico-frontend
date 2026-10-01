import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { logError } from "@/utils/logger";

export interface LogoutAllResponse {
  message: string;
  revokedSessions?: number;
}

/**
 * Revoca todas las sesiones activas del usuario en Redis y limpia las cookies HttpOnly.
 */
export const logoutAllAction = async (): Promise<LogoutAllResponse> => {
  try {
    const { data } = await soporteTecnicoApi.post<LogoutAllResponse>('/auth/logout-all');
    return data;
  } catch (error) {
    logError(error, "logoutAllAction", "Error al cerrar todas las sesiones");
    throw error;
  }
};

