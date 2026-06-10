import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ResponseFolio } from "../interfaces/get-folios.interface";


export const getResponseFolioAction = async (): Promise<ResponseFolio> => {

    const { data } = await soporteTecnicoApi.get<ResponseFolio>(`/folio-counters/current-period/responses`);

    return data
};