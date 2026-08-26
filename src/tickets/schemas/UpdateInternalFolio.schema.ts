import { z } from 'zod';
import type { TFunction } from 'i18next';

export const UpdateInternalFolioSchema = (t: TFunction) => z.object({
  internal_folio: z
    .string()
    .min(1, { message: t('common.validations.required') }),
});

export type UpdateInternalFolioFormInput = z.input<ReturnType<typeof UpdateInternalFolioSchema>>;
export type UpdateInternalFolioFormOutput = z.output<ReturnType<typeof UpdateInternalFolioSchema>>;
