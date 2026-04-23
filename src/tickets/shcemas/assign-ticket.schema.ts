import { z } from 'zod';
import type { TFunction } from 'i18next';

export const AssignTicketSchema = (t: TFunction) => z.object({
    technicianIds: z.array(
        z.string(
            t('tickets.form.assign.errors.technicians_required')
        ))
        .min(1, t('tickets.form.assign.errors.technicians_min'))
        .max(4, t('tickets.form.assign.errors.technicians_max')),
});

export type AssignTicketFormInput = z.input<ReturnType<typeof AssignTicketSchema>>;
export type AssignTicketFormOutput = z.output<ReturnType<typeof AssignTicketSchema>>;