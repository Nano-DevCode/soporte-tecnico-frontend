import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getAvailableActions, TicketEvent, type TicketStatus } from '@/tickets/utils/ticket-state-machine';
import { Send, XCircle, Wrench, type LucideIcon, UserPlus, Inbox, Edit3, Flag, Archive, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export type ActionBehavior = 'navigate' | 'direct' | 'confirm';
export type Variants = 'default' | 'destructive' | 'outline' | 'secondary';

interface EventUIConfig {
    label: string;
    icon: LucideIcon;
    variant: Variants;
    behavior: ActionBehavior;
    route?: (id: string) => string;
    confirmTitle?: string;
    confirmMessage?: string;
}
// TODO: TRADUCIR LOS MENSAJES.
const EVENT_UI_CONFIG: Partial<Record<TicketEvent, EventUIConfig>> = {
    [TicketEvent.RECIBIR]: {
        label: 'Recibir Ticket',
        icon: Inbox,
        variant: 'default',
        behavior: 'navigate',
        route: () => '/tickets/create'
    },
    [TicketEvent.CORREGIR]: {
        label: 'Editar',
        icon: Edit3,
        variant: 'outline',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/edit`
    },
    [TicketEvent.RECHAZAR]: {
        label: 'Rechazar',
        icon: XCircle,
        variant: 'destructive',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/reject`
    },
    [TicketEvent.CANALIZAR]: {
        label: 'Canalizar',
        icon: Send,
        variant: 'default',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/route`
    },
    [TicketEvent.ASIGNAR]: {
        label: 'Asignar Técnicos',
        icon: UserPlus,
        variant: 'default',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/assign`
    },
    [TicketEvent.ATENDER]: {
        label: 'Comenzar a Atender',
        icon: Wrench,
        variant: 'default',
        behavior: 'confirm',
        confirmTitle: '¿Iniciar atención del ticket?',
        confirmMessage: 'Se registrará tu hora de inicio y se notificará al usuario que vas en camino a revisar el equipo.'
    },
    [TicketEvent.FINALIZAR]: {
        label: 'Finalizar Trabajo',
        icon: Flag,
        variant: 'default',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/finish`
    },
    [TicketEvent.CERRAR]: {
        label: 'Cerrar Ticket',
        icon: Lock,
        variant: 'outline',
        behavior: 'confirm',
        confirmTitle: '¿Cerrar solicitud?',
        confirmMessage: 'Confirme la recepción de la orden de trabajo para dar por terminada la solicitud.'
    },
    [TicketEvent.ARCHIVAR]: {
        label: 'Mover al Archivo',
        icon: Archive,
        variant: 'secondary',
        behavior: 'confirm',
        confirmTitle: '¿Archivar esta solicitud?',
        confirmMessage: 'Confirme la recepción de los formatos de la solicitud.'
    },
    [TicketEvent.INTERVENIR]: {
        label: 'Registrar Bitácora',
        icon: Edit3,
        variant: 'default',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/intervene`
    },
};

interface TicketActionsProps {
    currentState: TicketStatus;
    ticketId: string;
    pendingEvent?: TicketEvent | null;
    onDirectAction?: (event: TicketEvent) => void;
}

export function TicketActions({ currentState, pendingEvent, ticketId, onDirectAction }: TicketActionsProps) {
    const availableActions = getAvailableActions(currentState);
    const navigate = useNavigate();
    const location = useLocation();

    const [eventToConfirm, setEventToConfirm] = useState<TicketEvent | null>(null);

    if (availableActions.length === 0) return null;

    const handleConfirm = () => {
        if (eventToConfirm && onDirectAction) {
            onDirectAction(eventToConfirm);
        }
        setEventToConfirm(null);
    };

    return (
        <>
            <div className="flex flex-wrap gap-2 w-full items-center justify-end">
                {availableActions.map((event) => {
                    const config = EVENT_UI_CONFIG[event];
                    if (!config) return null;

                    const ActionIcon = config.icon;
                    const isThisActionPending = pendingEvent === event;

                    const handleClick = () => {
                        if (config.behavior === 'navigate' && config.route) {
                            navigate(config.route(ticketId), {
                                state: { from: location.pathname },
                            });
                        } else if (config.behavior === 'direct' && onDirectAction) {
                            onDirectAction(event);
                        } else if (config.behavior === 'confirm') {
                            setEventToConfirm(event);
                        }
                    };

                    return (
                        <Button
                            key={event}
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
                            {config.label}
                        </Button>
                    );
                })}
            </div>

            <AlertDialog open={!!eventToConfirm} onOpenChange={(open) => !open && setEventToConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {eventToConfirm ? EVENT_UI_CONFIG[eventToConfirm]?.confirmTitle : ''}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {eventToConfirm ? EVENT_UI_CONFIG[eventToConfirm]?.confirmMessage : ''}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Sí, continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}