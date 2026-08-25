import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { TicketsAssignedesResponse } from "../interfaces/ticketAssignedes.interce";

export const getTicketsAssignedesAction = async(): Promise<TicketsAssignedesResponse[]> => {
  const { data } = await soporteTecnicoApi.get<TicketsAssignedesResponse[]>(`/tickets/options?status=ASIGNADA&status=ATENDIENDO&status=CANALIZADA`);  
  
  return data;
}