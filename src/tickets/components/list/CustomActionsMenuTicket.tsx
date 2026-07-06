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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TicketDocumentButton } from '../details/TicketDocumentButton';
import { TYPE_DOCUMENT_NAME } from '@/tickets/interfaces/ticket-details.response';

interface Props {
    ticket: Ticket;
    onDirectAction?: (event: TicketActionsType, ticketId: string) => void;
}

export const CustomActionsMenuTicket = (
    { ticket, onDirectAction }: Props
) => {
    const { t } = useTranslation();
    const [eventToConfirm, setEventToConfirm] = useState<TicketActionsType | null>(null);

    const availableActions = getAvailableActions(ticket.status_code as TicketStatusType);

    const requestDocument = ticket.documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM);
    const responseDocument = ticket.documents?.find((doc) => doc.type_document.name === TYPE_DOCUMENT_NAME.WORK_ORDER_FORM);


    const handleConfirm = () => {
        if (eventToConfirm && onDirectAction) {
            onDirectAction(eventToConfirm, ticket.id);
        }
        setEventToConfirm(null);
    };

    const currentConfig = eventToConfirm ? ACTION_UI_CONFIG[eventToConfirm] : null;
    const titleKey = currentConfig?.confirmTitle;
    const messageKey = currentConfig?.confirmMessage;

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

            <AlertDialog open={!!eventToConfirm} onOpenChange={(open) => !open && setEventToConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {titleKey ? t(titleKey) : null}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {messageKey ? t(messageKey) : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {eventToConfirm && (eventToConfirm === TicketActions.CERRAR || eventToConfirm === TicketActions.ARCHIVAR) && (
                        <div className="py-2 space-y-2">
                            {responseDocument && (
                                <TicketDocumentButton
                                    documentType={TYPE_DOCUMENT_NAME.WORK_ORDER_FORM}
                                    filename={responseDocument.name}
                                    className="w-full justify-start"
                                />
                            )}

                            {eventToConfirm === TicketActions.ARCHIVAR && requestDocument && (
                                <TicketDocumentButton
                                    documentType={TYPE_DOCUMENT_NAME.SERVICE_REQUEST_FORM}
                                    filename={requestDocument.name}
                                    className="w-full justify-start"
                                />
                            )}
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.buttons.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            {t('common.buttons.continue')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}
