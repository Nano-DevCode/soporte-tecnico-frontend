import { useCallback, useMemo } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { useNavigate, useSearchParams } from 'react-router';
import { useAllTickets } from '../hooks/useAllTickets';
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

export const CustomListTickets = () => {
    const { data, isLoading: skeletonLoading, isError, refetch } = useAllTickets();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

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

    const columns = useMemo(
        () => getTicketColumns(t, i18n),
        [t, i18n]
    );

    const ticketsList = data?.data ?? [];
    const totalData = data?.meta.total || 0;

    const table = useCustomTable({
        data: ticketsList,
        columns,
        sorting: tableSortingState,
        onSortingChange: handleSortingChange,
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
                        <RefreshCcw className="h-4 w-4" />
                        {t('common.buttons.retry')}
                    </Button>
                </Empty>
            ) :
                (
                    <>
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
                            />
                        </div>

                        <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
                    </>
                )
            }
        </>
    )
}
