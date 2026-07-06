import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { SubmitSurveyPayload } from "../schemas/createSurveySchema";

export interface Props {
    ticketId: string,
    answers?: SubmitSurveyPayload["answers"];
}

export const closeTicketAction = async (
    { ticketId, ...payload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/close`,
        payload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};