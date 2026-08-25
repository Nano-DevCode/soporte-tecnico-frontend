import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { OTFolio } from "../interfaces/get-folios.interface";
import type { OTFolioFormOutput } from "../schemas/UpdateOTFolio.schema";

export interface EditOTFolioParams {
    editOTPayload: OTFolioFormOutput;
}

export const updateOTFolioAction = async (
    { editOTPayload }: EditOTFolioParams
): Promise<OTFolio> => {

    const { data } = await soporteTecnicoApi.patch<OTFolio>(
        `/folio-counters/current-year/ot`,
        editOTPayload
    );

    return data;
};
