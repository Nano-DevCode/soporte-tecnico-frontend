import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ResponseFolio } from "../interfaces/get-folios.interface";
import type { ResponseFolioFormOutput } from "../schemas/UpdateResponsesFolio.schema";

export interface EditResponseFolioParams {
    editResponsePayload: ResponseFolioFormOutput;
}

export const updateResponseFolioAction = async (
    { editResponsePayload }: EditResponseFolioParams
): Promise<ResponseFolio> => {

    const { data } = await soporteTecnicoApi.patch<ResponseFolio>(
        `/folio-counters/current-year/responses`,
        editResponsePayload
    );

    return data;
};