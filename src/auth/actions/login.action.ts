import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";

export const loginAction = async(email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data } = await soporteTecnicoApi.post<AuthResponse>('/auth/login',{
        email,
        password
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
}