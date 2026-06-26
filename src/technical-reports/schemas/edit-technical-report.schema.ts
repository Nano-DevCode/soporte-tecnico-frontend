import { z } from 'zod';
import type { TFunction } from 'i18next';
import type { EquipmentItem } from '@/Equipments/interfaces/euipment-item.interface';

export const EditTechnicalReportSchema = (t: TFunction) => z.object({
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
    equipment_ids: z.custom<EquipmentItem[]>().optional().default([]),
    fault_validity_id: z.uuid(t('tickets.form.intervene.errors.fault_validity_invalid'))
        .min(1, t('tickets.form.intervene.errors.fault_validity_required')),
});

export type EditTechnicalReportFormInput = z.input<ReturnType<typeof EditTechnicalReportSchema>>;
export type EditTechnicalReportFormOutput = z.output<ReturnType<typeof EditTechnicalReportSchema>>;