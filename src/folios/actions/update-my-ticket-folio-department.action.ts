import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ItemFolio } from "../interfaces/get-folios.interface";
import type { TicketFolioFormOutput } from "../schemas/UpdateTicketFolioDepartment.schema";

export interface EditTicketParams {
    editTicketPayload: TicketFolioFormOutput;
}

export const updateMyTicketFolioDepartmentAction = async (
    { editTicketPayload }: EditTicketParams
): Promise<ItemFolio> => {

    const { data } = await soporteTecnicoApi.patch<ItemFolio>(
        `/folio-counters/current-period/my-department`,
        editTicketPayload
    );

    return data;
};