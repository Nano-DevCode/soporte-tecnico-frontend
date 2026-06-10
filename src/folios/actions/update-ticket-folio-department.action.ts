import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ItemFolio } from "../interfaces/get-folios.interface";
import type { TicketFolioFormOutput } from "../schemas/UpdateTicketFolioDepartment.schema";

export interface EditTicketParams {
    departmentId: string;
    editTicketPayload: TicketFolioFormOutput;
}

export const updateTicketFolioDepartmentAction = async (
    { departmentId, editTicketPayload }: EditTicketParams
): Promise<ItemFolio> => {

    const { data } = await soporteTecnicoApi.patch<ItemFolio>(
        `/folio-counters/current-period/departments/${departmentId}`,
        editTicketPayload
    );

    return data;
};