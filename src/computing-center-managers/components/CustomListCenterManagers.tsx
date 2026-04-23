import { useCallback } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomSkeletonTableCard } from '@/components/custom/CustomSkeletonTableCard';
import { useNavigate } from 'react-router';
import { useCenterManagers } from '../hooks/useCenterManagers';
import type { CenterManager } from '../interfaces/center-manager.interface';
import { useCenterManagerDialogStore } from '../stores/center-manager-dialog.store';
import { CustomDesktopTableCenterManagers } from './CustomDescktopTableCenterManagers';
import { CustomMobilCardCenterManagers } from './CustomMobileCardCenterManagers';

export const CustomListCenterManagers = () => {
    const { data, isLoading: skeletonLoading } = useCenterManagers();
    const navigate = useNavigate();

    const openDialog =
        useCenterManagerDialogStore((state) => state.openDialog);

    const handleActivateClick = useCallback((manager: CenterManager) => {
        openDialog(manager, 'activate');
    }, [openDialog]);

    const handleDeactivateClick = useCallback((manager: CenterManager) => {
        openDialog(manager, 'deactivate');
    }, [openDialog]);

    const handleCardClick = useCallback((id: string) => {
        navigate(`/center-managers/${id}`);
    }, [navigate]);


    if (skeletonLoading) {
        return <CustomSkeletonTableCard />;
    }

    const centerManagersList = data?.data ?? [];

    return (
        <>
            <div className='hidden md:block'>
                <CustomDesktopTableCenterManagers
                    centerManagers={centerManagersList}
                    handleActivateClick={handleActivateClick}
                    handleDeactivateClick={handleDeactivateClick}
                    handleRowClick={handleCardClick}
                />
            </div>
            <div className='md:hidden'>
                <CustomMobilCardCenterManagers
                    centerManagers={centerManagersList}
                    handleActivateClick={handleActivateClick}
                    handleDeactivateClick={handleDeactivateClick}
                    handleCardClick={handleCardClick}
                />
            </div>
            <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
        </>
    )
}
