import { CustomTitlePageWithBack } from '@/components/custom/CustomTitlePageWithBack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useGetTicketById } from '../hooks/useGetTicketById';
import { sileo } from 'sileo';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { TicketStepper } from '../components/details/TicketStepper';
import { DetailsTicket } from '../components/details/DetailsTicket';
import { DetailHeaderTicket } from '../components/details/DetailHeaderTicket';
import { TicketTimeLine } from '../components/details/TicketTimeLine';
import { useStartTicket } from '../hooks/useStartTicket';
import { getAvailableActions, TicketEvent } from '../utils/ticket-state-machine';
import { useCloseTicket } from '../hooks/useCloseTicket';
import { useArchiveTicket } from '../hooks/useArchiveTicket';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
import { TicketActions } from '../components/details/TicketActions';
import { TechnicalReportsAccordion } from '../components/details/TechnicalReportsAccordion';

export const ViewTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { isLoading, isError, data: ticket } = useGetTicketById(id);
    const { mutate: startTicket, isPending: isStarting } = useStartTicket();
    const { mutate: closeTicket, isPending: isClosing } = useCloseTicket();
    const { mutate: archiveTicket, isPending: isArchiving } = useArchiveTicket();

    useEffect(() => {
        if (!isLoading && (isError || !ticket)) {
            sileo.error({
                title: 'p',
                description: 'p',
                duration: 6000,
            });

            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, ticket, id, navigate, t]);

    const handleDirectAction = (event: TicketEvent) => {
        if (!ticket) return;
        if (event === TicketEvent.ATENDER) {
            startTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.attend.success_title', '¡Atención iniciada!'),
                        description: t('tickets.actions.attend.success_desc', 'El tiempo de resolución ha comenzado.'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title', 'Error'),
                        description: getAxiosErrorMessage(error) || 'No se pudo iniciar la atención.',
                    });
                }
            });
        }
        else if (event === TicketEvent.CERRAR) {
            closeTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.close.success_title', '¡Ticket cerrado!'),
                        description: t('tickets.actions.close.success_desc', 'El ticket se ha cerrado definitivamente y ya no admite modificaciones.'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title', 'Error'),
                        description: getAxiosErrorMessage(error) || 'No se pudo cerrar el ticket.',
                    });
                }
            });
        }
        else if (event === TicketEvent.ARCHIVAR) {
            archiveTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.archive.success_title', '¡Ticket archivado!'),
                        description: t('tickets.actions.archive.success_desc', 'El ticket ha sido movido al archivo histórico exitosamente.'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title', 'Error'),
                        description: getAxiosErrorMessage(error) || 'No se pudo archivar el ticket.',
                    });
                }
            });
        }
    };

    const currentPendingEvent =
        isStarting ? TicketEvent.ATENDER :
            isClosing ? TicketEvent.CERRAR :
                isArchiving ? TicketEvent.ARCHIVAR :
                    null;

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!ticket) {
        return null;
    }
    const canWatchTechnicalReports =
        getAvailableActions(ticket.currentStatusCode).includes(TicketEvent.WATCH_TECHNICAL_REPORT);
    return (
        <div className="space-y-5">
            <CustomTitlePageWithBack
                backLink="/tickets"
                title={t('tickets.view_page.title')}
                description={t('tickets.view_page.description')}
            />

            <DetailHeaderTicket
                ticket={ticket}
            />

            <TicketActions
                currentState={ticket.currentStatusCode}
                ticketId={ticket.id}
                onDirectAction={handleDirectAction}
                pendingEvent={currentPendingEvent}
            />
            <div className="hidden lg:block">
                <TicketStepper currentState={ticket.currentStatusCode} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <TicketTimeLine ticket_histories={ticket.ticket_histories} />
                </div>

                <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
                    <DetailsTicket ticket={ticket} />
                    {
                        canWatchTechnicalReports && <TechnicalReportsAccordion ticketId={ticket.id} />
                    }


                    {/* Documentos */}
                    {/* {(currentState?.code === 'Pu' || currentState?.code === 'Resuelta' || currentState?.code === 'Cerrada') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Documentos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {currentState.code === 'Pausa' && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => { }}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Descargar PDF de Pausa
                                        </Button>
                                    )}
                                    {(currentState.code === 'Resuelta' || currentState.code === 'Cerrada') && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => { }}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Descargar PDF de Finalización
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )} */}
                </div>
            </div>
        </div>
    )
}
