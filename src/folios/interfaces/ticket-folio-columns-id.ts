import type { DataItemFolio } from "./get-folios.interface";

export const TICKET_FOLIO_COLUMN_IDS = {
  DEPARTMENT_NAME: "department_name",
  ACRONYM: "acronym",
  PERIOD_NAME: "period_name",
  CURRENT_VALUE: "current_value",
  NEXT_VALUE: "next_value",
  NEXT_FOLIO_VALUE: "next_folio_preview",
  ACTIONS: "actions",
} as const satisfies Record<string, DataItemFolio | "actions">

export type TicketFolioColumnId = typeof TICKET_FOLIO_COLUMN_IDS[keyof typeof TICKET_FOLIO_COLUMN_IDS];