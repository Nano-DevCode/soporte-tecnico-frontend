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

export const getTicketColumns = (t: TFunction, i18n: i18n): ColumnDef<Ticket>[] => [
  {
    accessorKey: "folio",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.folio")),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold uppercase tracking-wider">
        {row.original.folio}
      </span>
    ),
  },
  {
    accessorKey: "jefe_depto.full_name",
    id: "department_manager",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.manager")),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-0.5">
        <span className="text-sm font-medium text-foreground line-clamp-1">
          {row.original.jefe_depto.full_name}
        </span>
        <span className="text-xs line-clamp-1 text-muted-foreground">
          {row.original.jefe_depto.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "issue_type.name",
    id: "issue_type",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.issue")),
    cell: ({ row }) => (
      <span className="line-clamp-2 font-medium">
        {row.original.issue_type.name}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.date")),
    cell: ({ row }) => (
      <span>{toFormatLocalDateString(row.original.created_at, i18n.language, "Pp a")}</span>
    ),
  },
  {
    accessorKey: "status_code",
    id: "status",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.status")),
    cell: ({ row }) => (
      <TicketStatusBadge statusCode={row.original.status_code} />
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => SortableHeader(column, t("tickets.list_page.table.headers.priority")),
    cell: ({ row }) => (
      <TicketPriorityBadge priority={row.original.priority} />
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <div className="text-center">{t("tickets.list_page.table.headers.actions")}</div>,
    cell: ({ row }) => (
      <div className="text-center" onClick={(e) => e.stopPropagation()}>
        <CustomActionsMenuTicket ticket={row.original} />
      </div>
    ),
  },
]