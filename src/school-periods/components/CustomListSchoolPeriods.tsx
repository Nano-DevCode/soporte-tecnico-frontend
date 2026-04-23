import { useCallback } from 'react'
import { useSchoolPeriods } from '../hooks/useSchoolPeriods';
import { CustomDesktopTableSchoolPeriod } from './CustomDesktopTableSchoolPeriod';
import { CustomMobilCardScholPeriods } from './CustomMobilCardSchoolPeriods';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomSkeletonTableCard } from '@/components/custom/CustomSkeletonTableCard';
import { useNavigate } from 'react-router';
import { useSchoolPeriodDialogStore } from '../store/school-period-dialog.store';
import type { SchoolPeriod } from '../interfaces/school-period.interface';

export const CustomListSchoolPeriods = () => {
    const { data, isLoading: skelettonLoading } = useSchoolPeriods();
    const navigate = useNavigate();

    const openDialog =
        useSchoolPeriodDialogStore((state) => state.openDialog);

    const handleActivateClick = useCallback((period: SchoolPeriod) => {
        openDialog(period, 'activate');
    }, [openDialog]);

    const handleDeactivateClick = useCallback((period: SchoolPeriod) => {
        openDialog(period, 'deactivate');
    }, [openDialog]);

    const handleCardClick = useCallback((id: string) => {
        navigate(`/school-period/${id}`);
    }, [navigate]);


    return (
        <>
            {skelettonLoading ? (
                <CustomSkeletonTableCard />
            ) : (
                <>

                    <CustomDesktopTableSchoolPeriod
                        schoolPeriods={data?.data ?? []}
                        handleActivateClick={handleActivateClick}
                        handleDeactivateClick={handleDeactivateClick}
                        handleRowClick={handleCardClick}
                    />
                    <CustomMobilCardScholPeriods
                        schoolPeriods={data?.data ?? []}
                        handleActivateClick={handleActivateClick}
                        handleDeactivateClick={handleDeactivateClick}
                        handleCardClick={handleCardClick}
                    />
                    <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
                </>
            )}
        </>
    )
}
