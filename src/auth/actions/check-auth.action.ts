import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { AuthResponse } from "../interfaces/authResponse.interface";

export const checkAuthAction = async(): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');

  if(!token) throw new Error('No token found');

  try {
    const { data } = await soporteTecnicoApi.get<AuthResponse>('/auth/check-auth-status');
    localStorage.setItem('token', data.token);
    return data;
  } catch {
    localStorage.removeItem('token');
    throw new Error('Tokend expired or not valid');
  }
}