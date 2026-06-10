// columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { TFunction } from "i18next"
import '@tanstack/react-table'
import { TICKET_FOLIO_COLUMN_IDS } from "../interfaces/ticket-folio-columns-id"
import { SortableHeader } from "@/tickets/components/list/table/SortableHeader"
import type { ItemFolio } from "../interfaces/get-folios.interface"
import { Link } from "react-router"
import { PencilLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Can } from "@/common/permission/Can"


export const getTicketFoliosColumns = (t: TFunction): ColumnDef<ItemFolio>[] => {
    return [
        {
            accessorKey: TICKET_FOLIO_COLUMN_IDS.DEPARTMENT_NAME,
            id: TICKET_FOLIO_COLUMN_IDS.DEPARTMENT_NAME,
            header: ({ column }) => SortableHeader(column, t("folios.list_page.table.headers.department_name")),
            cell: ({ row }) => (
                <span className="text-sm font-medium line-clamp-2">
                    {row.original.department_name}
                </span>
            ),
        },
        {
            accessorKey: TICKET_FOLIO_COLUMN_IDS.ACRONYM,
            id: TICKET_FOLIO_COLUMN_IDS.ACRONYM,
            header: ({ column }) => SortableHeader(column, t("folios.list_page.table.headers.acronym")),
            cell: ({ row }) => (
                <span className="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {row.original.acronym}
                </span>
            ),
        },
        {
            accessorKey: TICKET_FOLIO_COLUMN_IDS.PERIOD_NAME,
            id: TICKET_FOLIO_COLUMN_IDS.PERIOD_NAME,
            header: ({ column }) => SortableHeader(column, t("folios.list_page.table.headers.period_name")),
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.period_name}
                </span>
            ),
        },
        {
            accessorKey: TICKET_FOLIO_COLUMN_IDS.CURRENT_VALUE,
            id: TICKET_FOLIO_COLUMN_IDS.CURRENT_VALUE,
            header: ({ column }) => SortableHeader(column, t("folios.list_page.table.headers.current_value")),
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.current_value}
                </div>
            ),
        },
        {
            accessorKey: TICKET_FOLIO_COLUMN_IDS.NEXT_FOLIO_VALUE,
            id: TICKET_FOLIO_COLUMN_IDS.NEXT_FOLIO_VALUE,
            header: ({ column }) => SortableHeader(column, t("folios.list_page.table.headers.next_folio_preview")),
            cell: ({ row }) => (
                <span className="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-wider text-primary">
                    {row.original.next_folio_preview}
                </span>
            ),
        },
        {
            id: TICKET_FOLIO_COLUMN_IDS.ACTIONS,
            enableSorting: false,
            header: () => <div className="text-center">{t("folios.list_page.table.headers.actions")}</div>,
            cell: ({ row }) => (
                <div className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Can permission={'EDIT_TICKET_FOLIO_DEPARTMENT_DETAILS'}>
                        <Link to={`/folios/tickets/${row.original.department_id}/edit`}>
                            <Button variant="secondary" size={"xs"}>
                                <PencilLine className="w-4 h-4 mr-2" />
                                <span>{t('folios.actions.config_folio')}</span>
                            </Button>
                        </Link>
                    </Can>
                </div>
            ),
        },
    ]
}