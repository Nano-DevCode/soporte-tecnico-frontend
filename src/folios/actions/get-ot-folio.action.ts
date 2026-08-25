import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { OTFolio } from "../interfaces/get-folios.interface";


export const getOTFolioAction = async (): Promise<OTFolio> => {

    const { data } = await soporteTecnicoApi.get<OTFolio>(`/folio-counters/current-year/ot`);

    return data
};
