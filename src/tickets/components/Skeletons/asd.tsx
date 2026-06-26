import { SkeletonInfoRow } from '@/components/custom/CustomInfoRow';

export const DetailsResponseSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row flex-wrap gap-y-5 gap-x-2">
                <SkeletonInfoRow />
                <SkeletonInfoRow />
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-y-5 gap-x-2">
                <SkeletonInfoRow />
                <SkeletonInfoRow />
            </div>

            <SkeletonInfoRow isDescription />

            <SkeletonInfoRow isDescription />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <SkeletonInfoRow />
            </div>
        </div>
    );
};