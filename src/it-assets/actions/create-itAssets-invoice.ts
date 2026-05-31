import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Invoice } from "../interfaces/itAssetsInvoicesResponse.interface";

interface Options {
  name: string;
}

export const createItAssetsInvoiceAction = async(options: Options):Promise<Invoice> => {
  const { name } = options;
  const { data } = await soporteTecnicoApi.post<Invoice>('/it-assets-invoices', {
    name: name
  });  
  return data;
}