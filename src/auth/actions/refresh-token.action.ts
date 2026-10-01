import axios from 'axios';
import { API_BASE_URL } from '@/api/soporteTecnicoApi';
import type { AuthResponse } from '../interfaces/authResponse.interface';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user?: AuthResponse;
}

/**
 * Llama al endpoint de rotación de tokens enviando la cookie HttpOnly de refreshToken.
 * Usa una instancia directa de Axios para evitar interceptores cíclicos.
 */
export const refreshTokenAction = async (): Promise<RefreshTokenResponse> => {
  const { data } = await axios.post<RefreshTokenResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return data;
};
