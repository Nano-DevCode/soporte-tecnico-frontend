import { Skeleton } from "../ui/skeleton";

interface Props {
    label: string;
}


export const CustomSectionInfo = ({ label }: Props) => {
    return (
        <div className="flex items-center h-6 gap-2">
            <div className='bg-foreground h-full w-0.5' />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                {label}
            </h3>
        </div>
    )
}

export const SkeletonSectionInfo = () => (
    <div className="flex items-center h-6 gap-2">
        <div className='bg-muted-foreground/30 h-full w-0.5 ' />
        <Skeleton className="h-3 w-32" />
    </div>
);
