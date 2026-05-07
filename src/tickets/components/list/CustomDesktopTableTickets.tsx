import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TicketIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { CustomActionsMenuTicket } from "./CustomActionsMenuTicket";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import type { Ticket } from "@/tickets/interfaces/ticket.interface";
import { TicketStatusBadge } from "../TicketStatusBadge";
import { TicketPriorityBadge } from "../TicketPriorityBadge";

interface Props {
    tickets: Ticket[];
    handleRowClick: (id: string) => void;
}

export const CustomDesktopTableTickets = (
    { tickets, handleRowClick }: Props
) => {
    const { t, i18n } = useTranslation();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-40">
                        {t("tickets.list_page.table.headers.folio")}
                    </TableHead>

                    <TableHead className="w-75">
                        {t("tickets.list_page.table.headers.manager")}
                    </TableHead>

                    <TableHead className="w-50">
                        {t("tickets.list_page.table.headers.issue")}
                    </TableHead>

                    <TableHead className="w-45">
                        {t("tickets.list_page.table.headers.date")}
                    </TableHead>

                    <TableHead className="w-35">
                        {t("tickets.list_page.table.headers.status")}
                    </TableHead>

                    <TableHead className="w-35">
                        {t("tickets.list_page.table.headers.priority")}
                    </TableHead>

                    <TableHead className="w-20 text-center">
                        {t("tickets.list_page.table.headers.actions")}
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow
                        key={ticket.id}
                        className="transition-colors cursor-pointer text-muted-foreground"
                        onClick={() => handleRowClick(ticket.id)}
                    >
                        {/* FOLIO */}
                        <TableCell>
                            <span className="font-mono text-sm font-semibold uppercase tracking-wider">
                                {ticket.folio}
                            </span>
                        </TableCell>

                        {/* JEFE DE DEPARTAMENTO */}
                        <TableCell>
                            <div className="flex flex-col space-y-0.5">
                                <span className="text-sm font-medium text-foreground line-clamp-1">
                                    {ticket.jefe_depto.full_name}
                                </span>
                                <span className="text-xs line-clamp-1">
                                    {ticket.jefe_depto.email}
                                </span>
                            </div>
                        </TableCell>

                        {/* TIPO DE PROBLEMA */}
                        <TableCell>
                            <span className="line-clamp-2 font-medium">
                                {ticket.issue_type.name}
                            </span>
                        </TableCell>

                        {/* FECHA DE CREACIÓN */}
                        <TableCell>
                            {toFormatLocalDateString(ticket.created_at, i18n.language, "PPP p")}
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                            <TicketStatusBadge statusCode={ticket.status_code} />
                        </TableCell>

                        {/* PRIORITY */}
                        <TableCell>
                            <TicketPriorityBadge priority={ticket.priority} />
                        </TableCell>

                        {/* ACCIONES */}
                        <TableCell className="text-center">
                            <div onClick={(e) => e.stopPropagation()}>
                                <CustomActionsMenuTicket ticket={ticket} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}

                {tickets.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-75">
                            <CustomEmptyListState
                                icon={TicketIcon}
                                title={t("tickets.list_page.empty.title")}
                                description={t("tickets.list_page.empty.description")}
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};