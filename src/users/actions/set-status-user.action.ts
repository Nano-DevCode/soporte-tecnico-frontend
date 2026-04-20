import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { User } from "../interfaces/users.response"; // Asegúrate de que la ruta sea correcta

interface ChangeUserStatusOptions {
  id: string;
  status: boolean;
}

export const setStatusUserAction = async ({ id, status }: ChangeUserStatusOptions): Promise<User> => {
  try {
    const { data } = await soporteTecnicoApi.patch<User>(`/users/change/${id}`, { status });
    
    return data;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw new Error("No se pudo cambiar el estado del usuario");
  }
};