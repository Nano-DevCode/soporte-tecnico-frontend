import { CustomPagination } from '@/components/custom/CustomPagination';
import { useGetAllTechnicalReports } from '../hooks/useGetAllTechnicalReports';
import { CustomSkeletonTableCard } from '@/components/custom/CustomSkeletonTableCard';
import { CustomFilterTechnicalReports } from './CustomFilterTechnicalReports';
import { CustomDesktopTechnicalReports } from './list/CustomDesktopTechnicalReports';
import { useSearchParams } from 'react-router';

export const CustomListTechnicalReports = () => {
    const { data, isLoading: skeletonLoading } = useGetAllTechnicalReports();
    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get("search") || undefined;

    const reportsList = data?.data ?? [];

    if (skeletonLoading) {
        return <CustomSkeletonTableCard />;
    }

    return (
        <>
            <CustomFilterTechnicalReports />

            <CustomDesktopTechnicalReports data={reportsList} searchTerm={searchTerm} />
            <CustomPagination totalPages={data?.meta.lastPage ?? 0} />

        </>
    )
}
