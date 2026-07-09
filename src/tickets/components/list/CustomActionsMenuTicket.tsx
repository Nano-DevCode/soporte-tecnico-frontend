import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';
import type { Ticket } from '@/tickets/interfaces/ticket.interface';
import { getAvailableActions, TicketActions, type TicketActionsType, type TicketStatusType } from '@/tickets/utils/ticket-state-machine';
import { useState } from 'react';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';
import { Can } from '@/common/permission/Can';
import type { SubmitSurveyPayload } from '@/tickets/schemas/createSurveySchema';
import { Dialog } from '@/components/ui/dialog';
import { DialogClosedForm } from '../forms/DialogClosedForm';
import { DialogArchiveForm } from '../forms/DialogArchiveForm';
import { DialogAttendForm } from '../forms/DialogAttendContent';

interface Props {
    ticket: Ticket;
    onDirectAction?: (event: TicketActionsType, ticketId: string, payload?: SubmitSurveyPayload) => void;
}

export const CustomActionsMenuTicket = (
    { ticket, onDirectAction }: Props
) => {
    const { t } = useTranslation();
    const [eventToConfirm, setEventToConfirm] = useState<TicketActionsType | null>(null);

    const availableActions = getAvailableActions(ticket.status_code as TicketStatusType);

    const handleFormAction = (event: TicketActionsType, payload?: SubmitSurveyPayload) => {
        if (onDirectAction) {
            onDirectAction(event, ticket.id, payload);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    <DropdownMenuItem asChild>
                        <Link to={`/tickets/${ticket.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('common.buttons.view')}
                        </Link>
                    </DropdownMenuItem>

                    {availableActions.map((event) => {
                        const config = ACTION_UI_CONFIG[event];
                        if (!config) return null;

                        const ActionIcon = config.icon;

                        const handleClick = (e: React.MouseEvent) => {
                            if (config.behavior === 'direct' && onDirectAction) {
                                e.preventDefault();
                                onDirectAction(event, ticket.id);
                            } else if (config.behavior === 'confirm') {
                                e.preventDefault();
                                setEventToConfirm(event);
                            }
                        };

                        return (
                            <Can key={event} permission={config.permission}>
                                {config.behavior === 'navigate' && config.route ? (
                                    <DropdownMenuItem asChild>
                                        <Link to={config.route(ticket.id)}>
                                            <ActionIcon className="h-4 w-4 mr-2" />
                                            {t(config.label)}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={handleClick}>
                                        <ActionIcon className="h-4 w-4 mr-2" />
                                        {t(config.label)}
                                    </DropdownMenuItem>
                                )}
                            </Can>
                        );
                    })}

                </DropdownMenuContent>
            </DropdownMenu>

            {eventToConfirm && (
                <Dialog open={!!eventToConfirm} onOpenChange={(open) => !open && setEventToConfirm(null)}>
                    {eventToConfirm === TicketActions.CERRAR ? (
                        <DialogClosedForm
                            eventToConfirm={eventToConfirm}
                            setEventToConfirm={setEventToConfirm}
                            onDirectAction={handleFormAction}
                            documents={ticket.documents}
                        />
                    ) : eventToConfirm === TicketActions.ARCHIVAR ? (
                        <DialogArchiveForm
                            eventToConfirm={eventToConfirm}
                            setEventToConfirm={setEventToConfirm}
                            onDirectAction={handleFormAction}
                            documents={ticket.documents}
                        />
                    ) : eventToConfirm === TicketActions.ATENDER ? (
                        <DialogAttendForm
                            eventToConfirm={eventToConfirm}
                            setEventToConfirm={setEventToConfirm}
                            onDirectAction={handleFormAction}
                        />
                    ) : null}
                </Dialog>
            )}
        </>
    )
}
