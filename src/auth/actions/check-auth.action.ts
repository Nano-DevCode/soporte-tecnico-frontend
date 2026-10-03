import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";

export const checkAuthAction = async(): Promise<AuthResponse> => {
  try {
    const { data } = await soporteTecnicoApi.get<AuthResponse>('/auth/check-status');
    return data;
  } catch {
    throw new Error('Sesión expirada o no válida');
  }
}