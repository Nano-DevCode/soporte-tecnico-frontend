import type { TFunction } from "i18next";
import z from "zod";

export const OTFolioSchema = (t: TFunction, minValueFolio: number) => z.object({
    requestedNextFolio: z.coerce.number({
        error: t('folios.responses.forms.folio.errors.requested_folio_required')
    })
        .min(minValueFolio + 1, t('folios.responses.forms.folio.errors.requested_min_folio', { currentValueFolio: minValueFolio }))
        .int(t('folios.responses.forms.folio.errors.requested_folio_invalid'))
        .positive(t('folios.responses.forms.folio.errors.requested_folio_positive'))
});

export type OTFolioFormInput = z.input<ReturnType<typeof OTFolioSchema>>;
export type OTFolioFormOutput = z.output<ReturnType<typeof OTFolioSchema>>;
