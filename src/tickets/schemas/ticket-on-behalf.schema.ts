import type { TFunction } from "i18next";
import { TicketSchema } from "./ticket.schema";
import z from "zod";

export const TicketOnBehalfSchema = (t: TFunction) =>
    TicketSchema(t).extend({
        user_id: z.uuid(t('tickets.form.errors.user_id_required'))
    });

export type TicketOnBehalfFormInput = z.input<ReturnType<typeof TicketOnBehalfSchema>>;
export type TicketOnBehalfFormOutput = z.output<ReturnType<typeof TicketOnBehalfSchema>>;