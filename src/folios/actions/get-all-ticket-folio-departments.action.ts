import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { ItemFolio } from "../interfaces/get-folios.interface";

export const getAllTicketFolioDepartmentsAction = async (): Promise<ItemFolio[]> => {

    const { data } = await soporteTecnicoApi.get<ItemFolio[]>('/folio-counters/current-period/departments');
    return data;
}