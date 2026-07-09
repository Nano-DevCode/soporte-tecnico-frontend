import { useCallback, useMemo } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomMobileCardsTickets } from './list/CustomMobileCardsTickets';
import { DataTable } from '@/components/custom/DataTable';
import { useTranslation } from 'react-i18next';
import { getTicketColumns } from '../hooks/useTicketTableColumns';
import type { SortingState } from '@tanstack/react-table';
import { useCustomTable } from '@/components/hooks/useCustomTable';
import { CustomFilterTickets } from './CustomFilterTickets';
import { AlertCircle, RefreshCcw, TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CustomEmptyListState } from '@/components/custom/CustomEmptyListState';
import { TICKET_COLUMN_IDS } from '../interfaces/ticket-column-ids.types';
import { useCurrentForUser } from '../hooks/useGetCurrentForUser';
import { useCan } from '@/common/permission/useCan';
import { TicketActions, type TicketActionsType } from '../utils/ticket-state-machine';
import { useStartTicket } from '../hooks/useStartTicket';
import { useCloseTicket } from '../hooks/useCloseTicket';
import { useArchiveTicket } from '../hooks/useArchiveTicket';
import type { SubmitSurveyPayload } from '../schemas/createSurveySchema';
import { sileo } from 'sileo';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';

export const CustomCurrentTicketList = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading: skeletonLoading, isError, refetch, isFetching } = useCurrentForUser();
    const { can } = useCan();
    const { mutate: startTicket } = useStartTicket();
    const { mutate: closeTicket } = useCloseTicket();
    const { mutate: archiveTicket } = useArchiveTicket();

    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = useMemo(() => {
        const rawOrder = searchParams.get('sortOrder')?.toUpperCase();
        return rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : 'DESC';
    }, [searchParams]);

    const tableSortingState: SortingState = useMemo(() => [
        {
            id: sortBy,
            desc: sortOrder === 'DESC',
        }
    ], [sortBy, sortOrder]);

    const handleSortingChange = useCallback((newSorting: SortingState) => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);

            if (newSorting.length > 0) {
                params.set('sortBy', newSorting[0].id);
                params.set('sortOrder', newSorting[0].desc ? 'DESC' : 'ASC');
            } else {
                params.delete('sortBy');
                params.delete('sortOrder');
            }
            params.set('page', '1');
            return params;
        }, { replace: true });
    }, [setSearchParams]);

    const handleCardClick = useCallback((id: string) => {
        navigate(`/tickets/${id}`);
    }, [navigate]);

    const handleDirectAction = useCallback((
        event: TicketActionsType,
        ticketId: string,
        payload?: SubmitSurveyPayload
    ) => {
        if (!ticketId) return;

        if (event === TicketActions.ATENDER) {
            startTicket({ ticketId }, {
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
            if (!payload) {
                sileo.error({
                    title: t('common.errors.title'),
                    description: t('tickets.actions.close.error.description'),
                });
                return null
            }
            closeTicket({ ticketId, answers: payload.answers }, {
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
            archiveTicket({ ticketId }, {
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
    }, [startTicket, closeTicket, archiveTicket, t]);

    const columns = useMemo(
        () => getTicketColumns(t, i18n, can, handleDirectAction),
        [t, i18n, can, handleDirectAction]
    );

    const ticketsList = data?.data ?? [];
    const totalData = data?.meta.total || 0;

    const table = useCustomTable({
        data: ticketsList,
        columns,
        sorting: tableSortingState,
        onSortingChange: handleSortingChange,
        initialColumnVisibility: {
            [TICKET_COLUMN_IDS.TAGS]: false,
            [TICKET_COLUMN_IDS.REQUEST_DOCUMENT]: false,
            [TICKET_COLUMN_IDS.RESPONSE_DOCUMENT]: false,
        }
    });


    return (
        <>
            <CustomFilterTickets table={table} totalData={totalData} isLoadingData={skeletonLoading} />

            {isError ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={'icon'}>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>
                            {t('tickets.list_page.error.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {t('tickets.list_page.error.description')}
                        </EmptyDescription>
                    </EmptyHeader>
                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        <RefreshCcw className={isFetching ? 'animate-spin' : ''} />
                        {t('common.buttons.retry')}
                    </Button>
                </Empty>
            ) :
                (<>
                    <div className='hidden md:block'>
                        <DataTable
                            table={table}
                            columnsLength={columns.length}
                            onRowClick={(row) => handleCardClick(row.original.id)}
                            isLoading={skeletonLoading}
                            emptyState={
                                <CustomEmptyListState
                                    icon={TicketIcon}
                                    title={t("tickets.list_page.empty.title")}
                                    description={t("tickets.list_page.empty.description")}
                                />}
                        />
                    </div>
                    <div className='md:hidden'>
                        <CustomMobileCardsTickets
                            tickets={ticketsList}
                            handleCardClick={handleCardClick}
                            isLoading={skeletonLoading}
                            onDirectAction={handleDirectAction}
                        />
                    </div>

                    <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
                </>)
            }
        </>
    )
}
