import { z } from 'zod';
import type { TFunction } from 'i18next';

export const CenterManagerSchema = (t: TFunction) => z.object({
    names: z.string()
        .trim()
        .min(1, t('center_managers.form.errors.names_required'))
        .max(100, t('center_managers.form.errors.names_max')),

    first_last_name: z.string()
        .trim()
        .min(1, t('center_managers.form.errors.first_last_name_required'))
        .max(100, t('center_managers.form.errors.first_last_name_max')),

    second_last_name: z.string()
        .trim()
        .min(1, t('center_managers.form.errors.second_last_name_required'))
        .max(100, t('center_managers.form.errors.second_last_name_max')),

    rfc: z.string()
        .trim()
        .toUpperCase()
        .min(10, t('center_managers.form.errors.rfc_min'))
        .max(13, t('center_managers.form.errors.rfc_max'))
        .regex(/^[A-Z0-9]+$/, t('center_managers.form.errors.rfc_format')),
});

export type CenterManagerFormValues = z.infer<ReturnType<typeof CenterManagerSchema>>;