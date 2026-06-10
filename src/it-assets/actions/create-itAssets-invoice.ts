import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Invoice } from "../interfaces/itAssetsInvoicesResponse.interface";

interface Options {
  idInternal: string;
}

export const createItAssetsInvoiceAction = async(options: Options):Promise<Invoice> => {
  const { idInternal } = options;
  const { data } = await soporteTecnicoApi.post<Invoice>('/it-assets-invoices', {
    idInternal: idInternal
  });  
  return data;
}