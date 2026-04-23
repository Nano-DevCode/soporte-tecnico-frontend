import { useCallback } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomSkeletonTableCard } from '@/components/custom/CustomSkeletonTableCard';
import { useNavigate } from 'react-router';
import { useAllTickets } from '../hooks/useAllTickets';
import { CustomDesktopTableTickets } from './list/CustomDesktopTableTickets';
import { CustomMobileCardsTickets } from './list/CustomMobileCardsTickets';

// TODO: componente móvil esté listo
export const CustomListTickets = () => {
    const { data, isLoading: skeletonLoading } = useAllTickets();
    const navigate = useNavigate();

    const handleCardClick = useCallback((id: string) => {
        navigate(`/tickets/${id}`);
    }, [navigate]);

    if (skeletonLoading) {
        return <CustomSkeletonTableCard />;
    }

    const ticketsList = data?.data ?? [];

    return (
        <>
            <div className='hidden md:block'>

                <CustomDesktopTableTickets
                    tickets={ticketsList}
                    handleRowClick={handleCardClick}
                />
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
