import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { RolResponse } from "../interfaces/roles.response";

export const getRolesActions = async(): Promise<RolResponse> => {
  const { data } = await soporteTecnicoApi.get<RolResponse>('/roles');
  return data;
}