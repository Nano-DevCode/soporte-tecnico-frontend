import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ItemFolio } from "../interfaces/get-folios.interface";


export const getTicketFolioDepartmentByIdAction = async (idDepartment: string): Promise<ItemFolio> => {
    if (!idDepartment) throw new Error('Id department is required');

    const { data } = await soporteTecnicoApi.get<ItemFolio>(`/folio-counters/current-period/departments/${idDepartment}`);

    return data
};