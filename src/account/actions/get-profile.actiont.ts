import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { User } from "../../users/interfaces/users.response";

export const getProfileActions = async(): Promise<User> => {
  const { data } = await soporteTecnicoApi.get<User>(`/users/profile`);
  return data;
}