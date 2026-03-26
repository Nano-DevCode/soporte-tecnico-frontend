import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { User } from "../interfaces/users.response";

export const getUserAction = async (id: string): Promise<User> => {
  const { data } = await soporteTecnicoApi.get<User>(`/users/${id}`);
  return data;
};