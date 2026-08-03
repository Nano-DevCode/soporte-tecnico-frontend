import { z } from 'zod';
import type { TFunction } from 'i18next';
import type { EquipmentItem } from '@/Equipments/interfaces/euipment-item.interface';

export const InterveneTicketSchema = (t: TFunction) => z.object({
    diagnosis: z.string(t('tickets.form.intervene.errors.diagnosis_required'))
        .min(10, t('tickets.form.intervene.errors.diagnosis_min'))
        .max(1000, t('tickets.form.intervene.errors.diagnosis_max')),

    work_performed: z.string(t('tickets.form.intervene.errors.work_performed_required'))
        .min(10, t('tickets.form.intervene.errors.work_performed_min'))
        .max(2000, t('tickets.form.intervene.errors.work_performed_max')),
    materials_used: z.string(t('tickets.form.intervene.errors.materials_required'))
        .max(500, t('tickets.form.intervene.errors.materials_max'))
        .optional()
        .or(z.literal('')),
    is_resolved: z.boolean(t('tickets.form.intervene.errors.is_resolved_required')),
    tags: z.array(
        z.string(t('tickets.form.intervene.errors.tags_invalid'))
            .min(2, t('tickets.form.intervene.errors.tags_min'))
            .max(30, t('tickets.form.intervene.errors.tags_max'))
    )
        .max(10, t('tickets.form.intervene.errors.tags_max_items'))
        .optional()
        .default([]),
    equipment_ids: z.custom<EquipmentItem[]>().optional().default([]),
    fault_validity_id: z.uuid(t('tickets.form.intervene.errors.fault_validity_invalid'))
        .min(1, t('tickets.form.intervene.errors.fault_validity_required')),
    issue_type: z.coerce.number({
        error: t('tickets.form.errors.issue_type_invalid')
    })
        .int(t('tickets.form.errors.issue_type_invalid'))
        .positive(t('tickets.form.errors.issue_type_required')),
}).superRefine((data, ctx) => {
    if (data.is_resolved === true && data.tags.length === 0) {
        ctx.addIssue({
            code: "custom",
            message: t('tickets.form.intervene.errors.tags_required_when_resolved'),
            path: ['tags'],
        });
    }
});;

export type InterveneTicketFormInput = z.input<ReturnType<typeof InterveneTicketSchema>>;
export type InterveneTicketFormOutput = z.output<ReturnType<typeof InterveneTicketSchema>>;