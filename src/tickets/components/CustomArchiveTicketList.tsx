import { useCallback, useMemo } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomMobileCardsTickets } from './list/CustomMobileCardsTickets';
import { DataTable } from '@/components/custom/DataTable';
import { useTranslation } from 'react-i18next';
import type { SortingState } from '@tanstack/react-table';
import { useCustomTable } from '@/components/hooks/useCustomTable';
import { AlertCircle, RefreshCcw, TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CustomEmptyListState } from '@/components/custom/CustomEmptyListState';
import { useCan } from '@/common/permission/useCan';
import { TicketActions, type TicketActionsType } from '../utils/ticket-state-machine';
import { useArchiveTicket } from '../hooks/useArchiveTicket';
import { sileo } from 'sileo';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
import { useClosedArchivedTickets } from '../hooks/useGet';
import { getTicketArchiveColumns } from '../hooks/useTicketArchiveTableColumns ';
import { CustomFilterTicketsArchives } from './CustomFilterTicketsArchives';

export const CustomArchiveTicketList = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading: skeletonLoading, isError, refetch, isFetching } = useClosedArchivedTickets();
    const { can } = useCan();
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
    ) => {
        if (!ticketId) return;

        if (event === TicketActions.ARCHIVAR) {
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
    }, [archiveTicket, t]);

    const columns = useMemo(
        () => getTicketArchiveColumns(t, i18n, can, handleDirectAction),
        [t, i18n, can, handleDirectAction]
    );

    const ticketsList = data?.data ?? [];
    const totalData = data?.meta.total || 0;

    const table = useCustomTable({
        data: ticketsList,
        columns,
        sorting: tableSortingState,
        onSortingChange: handleSortingChange,
        initialColumnVisibility: {}
    });


    return (
        <>
            <CustomFilterTicketsArchives table={table} totalData={totalData} isLoadingData={skeletonLoading} />

            {isError ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={'icon'}>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>
                            {t('tickets.list_archive_page.error.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {t('tickets.list_archive_page.error.description')}
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
                                    title={t("tickets.list_archive_page.empty.title")}
                                    description={t("tickets.list_archive_page.empty.description")}
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
