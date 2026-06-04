import { Can } from '@/common/permission/Can';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';
import { getAvailableActions, TicketEvent, type TicketStatus } from '@/tickets/utils/ticket-state-machine';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface TicketActionsProps {
    currentState: TicketStatus;
    ticketId: string;
    pendingEvent?: TicketEvent | null;
    onDirectAction: (event: TicketEvent) => void;
}

export function TicketActions({ currentState, pendingEvent, ticketId, onDirectAction }: TicketActionsProps) {
    const availableActions = getAvailableActions(currentState);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [eventToConfirm, setEventToConfirm] = useState<TicketEvent | null>(null);

    if (availableActions.length === 0) return null;

    const handleConfirm = () => {
        if (eventToConfirm) {
            onDirectAction(eventToConfirm);
        }
        setEventToConfirm(null);
    };

    const currentConfig = eventToConfirm ? ACTION_UI_CONFIG[eventToConfirm] : null;
    const titleKey = currentConfig?.confirmTitle;
    const messageKey = currentConfig?.confirmMessage;

    return (
        <>
            <div className="flex flex-wrap gap-2 w-full items-center justify-end">
                {availableActions.map((event) => {
                    const config = ACTION_UI_CONFIG[event];
                    if (!config) return null;

                    const ActionIcon = config.icon;
                    const isThisActionPending = pendingEvent === event;

                    const handleClick = () => {
                        if (config.behavior === 'navigate' && config.route) {
                            navigate(config.route(ticketId));
                        } else if (config.behavior === 'direct' && onDirectAction) {
                            onDirectAction(event);
                        } else if (config.behavior === 'confirm') {
                            setEventToConfirm(event);
                        }
                    };

                    return (
                        <Can key={event} permission={config.permission}>
                            <Button
                                variant={config.variant}
                                disabled={!!pendingEvent}
                                onClick={handleClick}
                                className='flex-1 md:flex-initial transition-all'
                            >
                                {isThisActionPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <ActionIcon className="w-4 h-4 mr-2" />
                                )}
                                {t(config.label)}
                            </Button>
                        </Can>
                    );
                })}
            </div>

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
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.buttons.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            {t('common.buttons.continue')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}