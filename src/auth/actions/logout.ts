import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";

export const logoutAction = async(): Promise<AuthResponse> => {
    try {
      const { data } = await soporteTecnicoApi.post<AuthResponse>('/auth/logout');
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
}