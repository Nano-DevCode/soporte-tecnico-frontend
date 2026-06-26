import { SkeletonInfoRow } from '@/components/custom/CustomInfoRow';

export const DetailsTechnicalReportSkeleton = () => {
    return (
        <div className="space-y-5">
            {/* Fila 1: Estado y Falla (2 columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-2">
                <SkeletonInfoRow />
                <SkeletonInfoRow />
            </div>

            <SkeletonInfoRow isDescription />

            <SkeletonInfoRow isDescription />

            <SkeletonInfoRow isDescription />

            <SkeletonInfoRow isDescription />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <SkeletonInfoRow />
            </div>
        </div>
    );
};