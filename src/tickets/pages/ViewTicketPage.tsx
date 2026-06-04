import { CustomTitlePageWithBack } from '@/components/custom/CustomTitlePageWithBack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetTicketById } from '../hooks/useGetTicketById';
import { sileo } from 'sileo';
import { TicketStepper } from '../components/details/TicketStepper';
import { DetailsTicket } from '../components/details/DetailsTicket';
import { DetailHeaderTicket } from '../components/details/DetailHeaderTicket';
import { TicketTimeLine } from '../components/details/TicketTimeLine';
import { useStartTicket } from '../hooks/useStartTicket';
import { TicketEvent, TicketStatus } from '../utils/ticket-state-machine';
import { useCloseTicket } from '../hooks/useCloseTicket';
import { useArchiveTicket } from '../hooks/useArchiveTicket';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
import { TicketActions } from '../components/details/TicketActions';
import { TechnicalReportsAccordion } from '../components/details/TechnicalReportsAccordion';
import { TicketDocuments } from '../components/details/TicketDocuments';
import { Can } from '@/common/permission/Can';
import { useSmartNavigation } from '@/components/hooks/useSmartNavigation';
import { TicketActorsCard } from '../components/details/TicketActorsCard';
import { DetailHeaderTicketSkeleton } from '../components/Skeletons/DetailHeaderTicketSkeleton';
import { TicketActionsSkeleton } from '../components/Skeletons/TicketActionsSkeleton';
import { TicketStepperSkeleton } from '../components/Skeletons/TicketStepperSkeleton';
import { TicketTimeLineSkeleton } from '../components/Skeletons/TicketTimeLineSkeleton';
import { DetailsTicketSkeleton } from '../components/Skeletons/DetailsTicketSkeleton';
import { TicketDocumentsSkeleton } from '../components/Skeletons/TicketDocumentsSkeleton';
import { TechnicalReportsAccordionSkeleton } from '../components/Skeletons/TechnicalReportsAccordionSkeleton';

export const ViewTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback } = useSmartNavigation('/tickets');

    const { isLoading, isError, data: ticket } = useGetTicketById(id);
    const { mutate: startTicket, isPending: isStarting } = useStartTicket();
    const { mutate: closeTicket, isPending: isClosing } = useCloseTicket();
    const { mutate: archiveTicket, isPending: isArchiving } = useArchiveTicket();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !ticket) {
            sileo.error({
                title: t('tickets.not_found.title'),
                description: t('tickets.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, ticket, t, navigateFallback]);

    const handleDirectAction = (event: TicketEvent) => {
        if (!ticket) return;

        if (event === TicketEvent.ATENDER) {
            startTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.attend.success.title'),
                        description: t('tickets.actions.attend.success.description'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title'),
                        description: getAxiosErrorMessage(error) || t('tickets.actions.attend.error.description'),
                    });
                }
            });
        }
        else if (event === TicketEvent.CERRAR) {
            closeTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.close.success.title'),
                        description: t('tickets.actions.close.success.description'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title'),
                        description: getAxiosErrorMessage(error) || t('tickets.actions.close.error.description'),
                    });
                }
            });
        }
        else if (event === TicketEvent.ARCHIVAR) {
            archiveTicket({ ticketId: ticket.id }, {
                onSuccess: () => {
                    sileo.success({
                        title: t('tickets.actions.archive.success.title'),
                        description: t('tickets.actions.archive.success.description'),
                    });
                },
                onError: (error) => {
                    sileo.error({
                        title: t('common.errors.title'),
                        description: getAxiosErrorMessage(error) || t('tickets.actions.archive.error.description'),
                    });
                }
            });
        } else {
            console.warn(t('tickets.actions.unhandled_event', { event }));
        }
    };

    const currentPendingEvent =
        isStarting ? TicketEvent.ATENDER :
            isClosing ? TicketEvent.CERRAR :
                isArchiving ? TicketEvent.ARCHIVAR :
                    null;

    if (isLoading || !ticket) {
        return (
            <div className="space-y-4">
                <CustomTitlePageWithBack
                    backLink="/tickets"
                    title={t('tickets.view_page.title')}
                    description={t('tickets.view_page.description')}
                />

                <DetailHeaderTicketSkeleton />

                <TicketActionsSkeleton />

                <div className="hidden lg:block">
                    <TicketStepperSkeleton />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
                        {/* <TicketActorsCardSkeleton /> */}
                        <TicketTimeLineSkeleton />
                    </div>

                    <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
                        <DetailsTicketSkeleton />
                        <TechnicalReportsAccordionSkeleton />
                        <TicketDocumentsSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    const canWatchTechnicalReports = ticket.ticket_histories.some((th) =>
        th.status.code === TicketStatus.NO_SOLUCIONADA ||
        th.status.code === TicketStatus.SOLUCIONADA
    );

    return (
        <div className="space-y-4">
            <CustomTitlePageWithBack
                backLink="/tickets"
                title={t('tickets.view_page.title')}
                description={t('tickets.view_page.description')}
            />

            <DetailHeaderTicket ticket={ticket} />

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
                <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
                    <TicketActorsCard ticket={ticket} />
                    <TicketTimeLine ticket_histories={ticket.ticket_histories} />
                </div>

                <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
                    <DetailsTicket ticket={ticket} />

                    <Can permission='WATCH_TECHNICAL_REPORT'>
                        {canWatchTechnicalReports && <TechnicalReportsAccordion ticketId={ticket.id} />}
                    </Can>

                    <TicketDocuments documents={ticket.documents} />
                </div>
            </div>
        </div>
    )
}
