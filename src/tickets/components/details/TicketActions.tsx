import { Can } from '@/common/permission/Can';
import { Button } from '@/components/ui/button';
import { type Document } from '@/tickets/interfaces/ticket-details.response';
import { ACTION_UI_CONFIG } from '@/tickets/utils/action-ui-config';
import { getAvailableActions, TicketActions, type TicketActionsType, type TicketStatusType } from '@/tickets/utils/ticket-state-machine';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Dialog } from '@/components/ui/dialog';
import { DialogClosedForm } from '../forms/DialogClosedForm';
import { DialogArchiveForm } from '../forms/DialogArchiveForm';
import type { SubmitSurveyPayload } from '@/tickets/schemas/createSurveySchema';

interface TicketActionsProps {
    currentState: TicketStatusType;
    ticketId: string;
    pendingEvent?: TicketActionsType | null;
    documents?: Document[];
    onDirectAction: (event: TicketActionsType, payload?: SubmitSurveyPayload) => void;
}

export function TicketActionsComponent({ currentState, pendingEvent, ticketId, onDirectAction, documents }: TicketActionsProps) {
    const availableActions = getAvailableActions(currentState);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [eventToConfirm, setEventToConfirm] = useState<TicketActionsType | null>(null);

    if (availableActions.length === 0) return null;

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
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ActionIcon className="w-4 h-4" />
                                )}
                                {t(config.label)}
                            </Button>
                        </Can>
                    );
                })}
            </div>
            {eventToConfirm &&
                <Dialog open={!!eventToConfirm} onOpenChange={(open) => !open && setEventToConfirm(null)}>
                    {
                        eventToConfirm === TicketActions.CERRAR ?
                            <DialogClosedForm
                                eventToConfirm={eventToConfirm}
                                setEventToConfirm={setEventToConfirm}
                                onDirectAction={onDirectAction}
                                documents={documents}
                            />
                            : eventToConfirm === TicketActions.ARCHIVAR ?
                                <DialogArchiveForm
                                    eventToConfirm={eventToConfirm}
                                    setEventToConfirm={setEventToConfirm}
                                    onDirectAction={onDirectAction}
                                    documents={documents}
                                />
                                : null

                    }
                </Dialog>
            }

        </>
    );
}