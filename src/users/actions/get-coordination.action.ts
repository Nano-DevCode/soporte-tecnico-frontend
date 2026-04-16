import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { CoordinationResponse } from "../interfaces/users.response";

export const getCoordinationsActions = async(): Promise<CoordinationResponse> => {
  const { data } = await soporteTecnicoApi.get<CoordinationResponse>('/coordinations');
  return data;
}