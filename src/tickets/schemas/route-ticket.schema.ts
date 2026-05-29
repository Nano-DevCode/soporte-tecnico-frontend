import { z } from 'zod';
import type { TFunction } from 'i18next';

export const RouteTicketSchema = (t: TFunction) => z.object({
    coordinatorId: z.string(
        t('tickets.form.route.errors.coordination_required')
    ).min(1, t('tickets.form.route.errors.coordination_required')),
    priority: z.coerce.number({
        error: t('tickets.form.route.errors.priority_invalid'),
    })
        .int(t('tickets.form.route.errors.priority_invalid'))
        .min(1, t('tickets.form.route.errors.priority_min'))
        .max(4, t('tickets.form.route.errors.priority_max'))
        .optional(),

});

export type RouteTicketFormInput = z.input<ReturnType<typeof RouteTicketSchema>>;
export type RouteTicketFormOutput = z.output<ReturnType<typeof RouteTicketSchema>>;