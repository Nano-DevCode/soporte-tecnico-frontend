// columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Ticket } from "@/tickets/interfaces/ticket.interface"
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string"
import { TicketStatusBadge } from "../components/TicketStatusBadge"
import { TicketPriorityBadge } from "../components/TicketPriorityBadge"
import { CustomActionsMenuTicket } from "../components/list/CustomActionsMenuTicket"
import type { i18n, TFunction } from "i18next"
import { SortableHeader } from "../components/list/table/SortableHeader"
import { TICKET_COLUMN_IDS } from "../interfaces/ticket-column-ids.types"

import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    classNameHead: string
  }
}

export const getTicketColumns = (t: TFunction, i18n: i18n): ColumnDef<Ticket>[] => {
  return [
    {
      accessorKey: "folio",
      id: TICKET_COLUMN_IDS.FOLIO,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.folio")),
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-wider">
          {row.original.folio}
        </span>
      )
    },
    {
      accessorKey: "school_period.name",
      id: TICKET_COLUMN_IDS.SCHOOL_PERIOD,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.school_period")),
      cell: ({ row }) => (
        row.original.school_period.name
      ),
    },
    {
      accessorKey: "jefe_depto.department.name",
      id: TICKET_COLUMN_IDS.DEPARTMENT,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.department")),
      cell: ({ row }) => (
        <div className="flex flex-col space-y-0.5">
          <span className="text-sm font-medium line-clamp-1">
            {row.original.jefe_depto.department.name}
          </span>
          <span className="text-xs line-clamp-1 text-muted-foreground">
            {row.original.jefe_depto.full_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "issue_type.name",
      id: TICKET_COLUMN_IDS.ISSUE_TYPE,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.issue_type")),
      cell: ({ row }) => (
        <span className="text-sm font-medium line-clamp-2">
          {row.original.issue_type.name}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      id: TICKET_COLUMN_IDS.CREATED_AT,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.created_at")),
      cell: ({ row }) => (
        <>
          <div>{toFormatLocalDateString(row.original.created_at, i18n.language, "P")}</div>
          <div>{toFormatLocalDateString(row.original.created_at, i18n.language, "p a")}</div>
        </>
      ),
    },
    {
      accessorKey: "status_code",
      id: TICKET_COLUMN_IDS.STATUS,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.status")),
      cell: ({ row }) => (
        <TicketStatusBadge statusCode={row.original.status_code} />
      ),
    },
    {
      accessorKey: "priority",
      id: TICKET_COLUMN_IDS.PRIORITY,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.priority")),
      cell: ({ row }) => (
        <TicketPriorityBadge priority={row.original.priority} />
      ),
    },
    {
      accessorKey: "tags",
      id: TICKET_COLUMN_IDS.TAGS,
      header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.tags")),
      cell: ({ row }) => {
        const tagsNames = row.original.tags.map((t) => t.name);
        return (
          <span className="text-xs font-semibold text-muted-foreground uppercase" >
            {
              (tagsNames.length <= 0)
                ? t("tickets.data_default.tags")
                : tagsNames.join(', ')
            }
          </span >
        )
      },
    },
    {
      id: TICKET_COLUMN_IDS.ACTIONS,
      enableSorting: false,
      header: () => <div className="text-center">{t("tickets.list_page.table.headers.actions")}</div>,
      cell: ({ row }) => (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <CustomActionsMenuTicket ticket={row.original} />
        </div>
      ),
    },
  ]
}