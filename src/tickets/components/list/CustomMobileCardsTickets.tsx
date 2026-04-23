import { useTranslation } from "react-i18next";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import { CustomActionsMenuTicket } from "./CustomActionsMenuTicket";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { cn } from "@/lib/utils";
import { CalendarDays, TicketIcon, Wrench } from "lucide-react";
import type { Ticket } from "@/tickets/interfaces/ticket.interface";

interface Props {
    tickets: Ticket[];
    handleCardClick: (id: string) => void;
}

export const CustomMobileCardsTickets = ({ tickets, handleCardClick }: Props) => {
    const { t, i18n } = useTranslation();

    // Reutilizamos la misma lógica de colores que tienes en la tabla Desktop
    const getStatusBadgeStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes("abierto") || s.includes("pendiente") || s.includes("nuevo")) {
            return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900";
        }
        if (s.includes("progreso") || s.includes("asignado")) {
            return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-900";
        }
        if (s.includes("resuelto") || s.includes("cerrado") || s.includes("completado")) {
            return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-900";
        }
        return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    };

    return (
        <div className="space-y-3">
            {tickets.map((ticket) => (
                <Item
                    variant='muted'
                    key={ticket.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer transition-all active:scale-[0.98] hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => handleCardClick(ticket.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick(ticket.id);
                        }
                    }}
                >
                    {/* Avatar ancla visual del ticket */}
                    <ItemMedia className="h-10 w-10 rounded-full bg-primary/10 ">
                        <TicketIcon className="h-5 w-5" />
                    </ItemMedia>

                    <ItemContent>
                        {/* Título: Quién solicita el soporte */}
                        <ItemTitle className="truncate text-base">
                            {ticket.jefe_depto.full_name}
                        </ItemTitle>

                        <div className="flex flex-col gap-2">

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5">
                                    <span className="font-mono font-bold tracking-wider uppercase text-foreground">
                                        #{ticket.folio}
                                    </span>
                                </Badge>

                                <Badge
                                    variant="outline"
                                    className={cn("px-2.5 py-0.5 font-semibold", getStatusBadgeStyles(ticket.status))}
                                >
                                    {ticket.status}
                                </Badge>
                            </div>

                            {/* Fila 2: Detalles técnicos con iconos de contexto */}
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Wrench className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                    <span className="line-clamp-1">{ticket.issue_type.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                    <span>{toFormatLocalDateString(ticket.created_at, i18n.language, "PPP")}</span>
                                </div>
                            </div>
                        </div>
                    </ItemContent>

                    {/* Acciones */}
                    <ItemActions className="shrink-0">
                        <div onClick={(e) => e.stopPropagation()}>
                            <CustomActionsMenuTicket ticket={ticket} />
                        </div>
                    </ItemActions>
                </Item>
            ))}

            {/* Estado Vacío */}
            {tickets.length === 0 && (
                <Item variant='muted' className="pointer-events-none">
                    <CustomEmptyListState
                        icon={TicketIcon}
                        title={t("tickets.list_page.empty.title")}
                        description={t("tickets.list_page.empty.description")}
                    />
                </Item>
            )}
        </div>
    );
}