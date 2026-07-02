export const TICKET_COLUMN_IDS = {
  FOLIO: "folio",
  DEPARTMENT: "department",
  ISSUE_TYPE: "issue_type",
  CREATED_AT: "created_at",
  STATUS: "status",
  PRIORITY: "priority",
  ACTIONS: "actions",
  SCHOOL_PERIOD: "school_period",
  TAGS: "tags",
  REQUEST_DOCUMENT: "request_document",
  RESPONSE_DOCUMENT: "response_document"
} as const;

export type TicketColumnId = typeof TICKET_COLUMN_IDS[keyof typeof TICKET_COLUMN_IDS];