import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Invoice } from "../interfaces/toolsInvoicesResponse.interface";

interface Options {
  idInternal: string;
}

export const createToolsInvoiceAction = async(options: Options):Promise<Invoice> => {
  const { idInternal } = options;
  const { data } = await soporteTecnicoApi.post<Invoice>('/tools-invoices', {
    idInternal: idInternal
  });  
  return data;
}