import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ResponseDetails } from "../interfaces/get-response-by-ticket";


export const getResponseByTicketIdAction = async (id: string): Promise<ResponseDetails> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<ResponseDetails>(`/tickets/${id}/response`);

    return data;
};