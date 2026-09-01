import type { TFunction } from "i18next";
import z from "zod";

export const ResponseFolioSchema = (t: TFunction, minValueFolio: number = 1) => z.object({
    requestedNextFolio: z.coerce.number({
        error: t('folios.responses.forms.folio.errors.requested_folio_required')
    })
        .min(minValueFolio + 1, t('folios.responses.forms.folio.errors.requested_min_folio', { currentValueFolio: minValueFolio }))
        .int(t('folios.responses.forms.folio.errors.requested_folio_invalid'))
        .positive(t('folios.responses.forms.folio.errors.requested_folio_positive'))
});

export type ResponseFolioFormInput = z.input<ReturnType<typeof ResponseFolioSchema>>;
export type ResponseFolioFormOutput = z.output<ReturnType<typeof ResponseFolioSchema>>;