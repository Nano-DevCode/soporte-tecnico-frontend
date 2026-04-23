import { z } from 'zod';
import type { TFunction } from 'i18next';

export const FinishTicketSchema = (t: TFunction) => z.object({
    diagnosis: z.string(t('tickets.form.finish.errors.diagnosis_required'))
        .min(10, t('tickets.form.finish.errors.diagnosis_min'))
        .max(1000, t('tickets.form.finish.errors.diagnosis_max')),

    work_done: z.string(t('tickets.form.finish.errors.work_done_required'))
        .min(10, t('tickets.form.finish.errors.work_done_min'))
        .max(2000, t('tickets.form.finish.errors.work_done_max')),

    maintenance_type_id: z.uuid(t('tickets.form.finish.errors.maintenance_type_required'))
        .min(1, t('tickets.form.finish.errors.maintenance_type_required')),

    service_type_id: z.uuid(t('tickets.form.finish.errors.service_type_required'))
        .min(1, t('tickets.form.finish.errors.service_type_required')),
});

export type FinishTicketFormInput = z.input<ReturnType<typeof FinishTicketSchema>>;
export type FinishTicketFormOutput = z.output<ReturnType<typeof FinishTicketSchema>>;