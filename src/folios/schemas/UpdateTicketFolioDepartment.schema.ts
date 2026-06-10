import type { TFunction } from "i18next";
import z from "zod";

export const TicketFolioSchema = (t: TFunction, minValueFolio: number) => z.object({
    requestedNextFolio: z.coerce.number({
        error: t('folios.tickets.forms.folio.errors.requested_folio_required')
    })
        .min(minValueFolio + 1, t('folios.tickets.forms.folio.errors.requested_min_folio', { currentValueFolio: minValueFolio }))
        .int(t('folios.tickets.forms.folio.errors.requested_folio_invalid'))
        .positive(t('folios.tickets.forms.folio.errors.requested_folio_positive'))
});

export type TicketFolioFormInput = z.input<ReturnType<typeof TicketFolioSchema>>;
export type TicketFolioFormOutput = z.output<ReturnType<typeof TicketFolioSchema>>;