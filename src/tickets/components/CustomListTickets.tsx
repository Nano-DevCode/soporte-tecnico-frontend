import { useCallback, useMemo } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomSkeletonTableCard } from '@/components/custom/CustomSkeletonTableCard';
import { useNavigate, useSearchParams } from 'react-router';
import { useAllTickets } from '../hooks/useAllTickets';
import { CustomMobileCardsTickets } from './list/CustomMobileCardsTickets';
import { DataTable } from '@/components/custom/DataTable';
import { useTranslation } from 'react-i18next';
import { getTicketColumns } from '../hooks/useTicketTableColumns';
import type { SortingState } from '@tanstack/react-table';

// TODO: componente móvil esté listo
export const CustomListTickets = () => {
    const { data, isLoading: skeletonLoading } = useAllTickets();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    const tableSortingState: SortingState = useMemo(() => [
        {
            id: sortBy,
            desc: sortOrder === 'DESC',
        }
    ], [sortBy, sortOrder]);

    const handleSortingChange = useCallback((newSorting: SortingState) => {
        const params = new URLSearchParams(searchParams);

        if (newSorting.length > 0) {
            params.set('sortBy', newSorting[0].id);
            params.set('sortOrder', newSorting[0].desc ? 'DESC' : 'ASC');
        } else {
            params.delete('sortBy');
            params.delete('sortOrder');
        }

        params.set('page', '1');

        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    const handleCardClick = useCallback((id: string) => {
        navigate(`/tickets/${id}`);
    }, [navigate]);

    const columns = useMemo(
        () => getTicketColumns(t, i18n),
        [t, i18n]
    );


    if (skeletonLoading) {
        return <CustomSkeletonTableCard />;
    }

    const ticketsList = data?.data ?? [];

    return (
        <>
            <div className='hidden md:block'>
                {/* <CustomDesktopTableTickets
                    tickets={ticketsList}
                    handleRowClick={handleCardClick}
                /> */}
                <DataTable columns={columns} data={ticketsList} onSortingChange={handleSortingChange} sorting={tableSortingState} />
            </div>
            <div className='md:hidden'>
                <CustomMobileCardsTickets
                    tickets={ticketsList}
                    handleCardClick={handleCardClick}
                />
            </div>
            <CustomPagination totalPages={data?.meta.lastPage ?? 0} />

        </>
    )
}
