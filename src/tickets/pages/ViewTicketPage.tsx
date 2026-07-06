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
import { getAvailableActions, TicketActions, type TicketActionsType } from '../utils/ticket-state-machine';
import { useCloseTicket } from '../hooks/useCloseTicket';
import { useArchiveTicket } from '../hooks/useArchiveTicket';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
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
import { TechnicalReportsAccordionSkeleton } from '../../technical-reports/components/skeletons/TechnicalReportsAccordionSkeleton';
import { TicketActionsComponent } from '../components/details/TicketActions';
import { TechnicalReportsOfTicketItems } from '@/technical-reports/components/TechnicalReportsItemsOfTicket';
import type { SubmitSurveyPayload } from '../schemas/createSurveySchema';

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

    const handleDirectAction = (event: TicketActionsType, payload?: SubmitSurveyPayload) => {
        if (!ticket) return;

        if (event === TicketActions.ATENDER) {
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
        else if (event === TicketActions.CERRAR) {
            closeTicket({ ticketId: ticket.id, ...payload }, {
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
        else if (event === TicketActions.ARCHIVAR) {
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
        isStarting ? TicketActions.ATENDER :
            isClosing ? TicketActions.CERRAR :
                isArchiving ? TicketActions.ARCHIVAR :
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

    const canWatchTechnicalReports = ticket.ticket_histories.some((history) =>
        getAvailableActions(history.status.code).includes(TicketActions.WATCH_TECHNICAL_REPORT)
    );

    return (
        <div className="space-y-4">
            <CustomTitlePageWithBack
                backLink="/tickets"
                title={t('tickets.view_page.title')}
                description={t('tickets.view_page.description')}
            />

            <DetailHeaderTicket ticket={ticket} />

            <Can permission='WATCH_TICKET_ACTIONS'>
                <TicketActionsComponent
                    currentState={ticket.currentStatusCode}
                    ticketId={ticket.id}
                    onDirectAction={handleDirectAction}
                    pendingEvent={currentPendingEvent}
                    documents={ticket.documents}
                />
            </Can>

            <Can permission='WATCH_TICKET_STEPPER'>
                <div className="hidden lg:block">
                    <TicketStepper currentState={ticket.currentStatusCode} />
                </div>
            </Can>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
                    <Can permission='WATCH_TICKET_ACTORS'>
                        <TicketActorsCard ticket={ticket} />
                    </Can>
                    <Can permission='WATCH_TICKET_TIMELINE'>
                        <TicketTimeLine ticket_histories={ticket.ticket_histories} />
                    </Can>
                </div>

                <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
                    <DetailsTicket ticket={ticket} />

                    <Can permission='WATCH_TECHNICAL_REPORT'>
                        {canWatchTechnicalReports && <TechnicalReportsOfTicketItems ticketId={ticket.id} />}
                    </Can>

                    <Can permission='WATCH_TICKET_DOCUMENTS'>
                        <TicketDocuments documents={ticket.documents} />
                    </Can>
                </div>
            </div>
        </div>
    )
}
