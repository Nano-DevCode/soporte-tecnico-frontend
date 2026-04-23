import { z } from 'zod';
import type { TFunction } from 'i18next';

export const InterveneTicketSchema = (t: TFunction) => z.object({
    diagnosis: z.string(t('tickets.form.intervene.errors.diagnosis_required'))
        .min(10, t('tickets.form.intervene.errors.diagnosis_min'))
        .max(1000, t('tickets.form.intervene.errors.diagnosis_max')),

    work_performed: z.string(t('tickets.form.intervene.errors.work_performed_required'))
        .min(10, t('tickets.form.intervene.errors.work_performed_min'))
        .max(2000, t('tickets.form.intervene.errors.work_performed_max')),
    required_materials: z.string(t('tickets.form.intervene.errors.materials_required'))
        .max(500, t('tickets.form.intervene.errors.materials_max'))
        .optional()
        .or(z.literal('')),
    is_resolved: z.boolean(t('tickets.form.intervene.errors.is_resolved_required')),
});

export type InterveneTicketFormInput = z.input<ReturnType<typeof InterveneTicketSchema>>;
export type InterveneTicketFormOutput = z.output<ReturnType<typeof InterveneTicketSchema>>;