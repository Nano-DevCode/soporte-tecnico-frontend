import { useTranslation } from "react-i18next";
import { Item } from "@/components/ui/item";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import { CustomActionsMenuTicket } from "./CustomActionsMenuTicket";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
import { Building2, TicketIcon } from "lucide-react";
import type { Ticket } from "@/tickets/interfaces/ticket.interface";
import { TicketStatusBadge } from "../TicketStatusBadge";
import { TicketPriorityBadge } from "../TicketPriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SkeletonMobileCardTickets } from "../Skeletons/SkeletonMobileCardTickets";
import { Separator } from "@/components/ui/separator";
import { TicketTagsBadge } from "../TicketTagsBadge";

interface Props {
    tickets: Ticket[];
    handleCardClick: (id: string) => void;
    isLoading: boolean
}

export const CustomMobileCardsTickets = ({ tickets, handleCardClick, isLoading }: Props) => {
    const { t, i18n } = useTranslation();

    if (isLoading) return <SkeletonMobileCardTickets />

    return (
        <div className="space-y-3">
            {tickets.map((ticket) => (
                <Card
                    className="transition-all hover:bg-muted/50 active:scale-[0.98] cursor-pointer p-4 flex flex-col gap-3 shadow-sm"
                    onClick={() => handleCardClick(ticket.id)}
                    key={ticket.id}
                >
                    <div className="flex items-start justify-between gap-2">

                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <Building2 className="h-4 w-4" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold leading-none text-foreground truncate">
                                    {ticket.jefe_depto?.department?.name || t('tickets.data_default.department')}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground mt-1">
                                    #{ticket.folio}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-muted-foreground">
                                {toFormatLocalDateString(ticket.created_at, i18n.language, "MMM d")}
                            </span>
                            <div onClick={(e) => e.stopPropagation()} className="-mr-2">
                                <CustomActionsMenuTicket ticket={ticket} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 pl-10">
                        <h3 className="text-sm font-bold text-foreground line-clamp-1">
                            {ticket.issue_type?.name || t('tickets.data_default.issue_type')}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {ticket.description}
                        </p>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 pl-10 flex-wrap">
                        <TicketStatusBadge statusCode={ticket.status_code} />
                        <TicketPriorityBadge priority={ticket.priority} />
                        <Badge variant="outline" className="text-muted-foreground">
                            {ticket.school_period?.name || t('tickets.data_default.school_period')}
                        </Badge>
                        <TicketTagsBadge tags={ticket.tags} />
                    </div>
                </Card>
            ))}

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