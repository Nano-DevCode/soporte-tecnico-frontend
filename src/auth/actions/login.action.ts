import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";
import { logError } from "@/utils/logger";

export const loginAction = async(email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data } = await soporteTecnicoApi.post<AuthResponse>('/auth/login',{
        email,
        password
      });
      return data;
    } catch (error) {
      logError(error, "loginAction");
      throw error;
    }
}