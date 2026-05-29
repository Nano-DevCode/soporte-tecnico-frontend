import { z } from 'zod';
import type { TFunction } from 'i18next';

export const RejectTicketSchema = (t: TFunction) => z.object({
    justification: z.string(t('tickets.form.reject.errors.justification_required'))
        .min(10, t('tickets.form.reject.errors.justification_min'))
        .max(1000, t('tickets.form.reject.errors.justification_max')),
});

export type RejectTicketFormInput = z.input<ReturnType<typeof RejectTicketSchema>>;
export type RejectTicketFormOutput = z.output<ReturnType<typeof RejectTicketSchema>>;