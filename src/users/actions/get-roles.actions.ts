import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { RolesResponse } from "../interfaces/roles.response";

export const getRolesActions = async(): Promise<RolesResponse> => {
  const { data } = await soporteTecnicoApi.get<RolesResponse>('/roles');
  return data;
}