import { z } from 'zod';
import type { TFunction } from 'i18next';

export const TicketSchema = (t: TFunction) => z.object({
    description: z.string(t('tickets.form.errors.description_required'))
        .trim()
        .min(1, t('tickets.form.errors.description_required'))
        .max(1000, t('tickets.form.errors.description_max')),

    affected_name: z.string(t('tickets.form.errors.affected_name_required'))
        .trim()
        .min(1, t('tickets.form.errors.affected_name_required'))
        .max(100, t('tickets.form.errors.affected_name_max')),

    evidence_url: z.union([
        z.httpUrl(t('tickets.form.errors.evidence_url_format')),
        z.literal('')
    ])
        .optional()
        .transform((val) => (val === '' ? undefined : val)),

    contact_email: z.email(t('tickets.form.errors.contact_email_format'))
        .trim(),

    available_hours: z.string(t('tickets.form.errors.available_hours_required'))
        .trim()
        .min(1, t('tickets.form.errors.available_hours_required'))
        .max(100, t('tickets.form.errors.available_hours_max')),

    equipment_location: z.string(t('tickets.form.errors.equipment_location_required'))
        .trim()
        .min(1, t('tickets.form.errors.equipment_location_required'))
        .max(200, t('tickets.form.errors.equipment_location_max')),

    issue_type: z.coerce.number({
        error: t('tickets.form.errors.issue_type_invalid')
    })
        .int(t('tickets.form.errors.issue_type_invalid'))
        .positive(t('tickets.form.errors.issue_type_required')),
});

export type TicketFormInput = z.input<ReturnType<typeof TicketSchema>>;

export type TicketFormOutput = z.output<ReturnType<typeof TicketSchema>>;