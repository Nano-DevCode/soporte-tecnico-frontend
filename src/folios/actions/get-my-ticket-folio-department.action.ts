import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ItemFolio } from "../interfaces/get-folios.interface";


export const getMyTicketFolioDepartmentAction = async (): Promise<ItemFolio> => {

    const { data } = await soporteTecnicoApi.get<ItemFolio>(`/folio-counters/current-period/my-department`);

    return data
};