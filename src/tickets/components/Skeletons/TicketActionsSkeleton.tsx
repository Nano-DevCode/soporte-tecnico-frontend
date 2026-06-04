import { Skeleton } from "@/components/ui/skeleton";

export function TicketActionsSkeleton() {
    return (
        <div className="flex flex-wrap gap-2 w-full items-center justify-end">
            <Skeleton className="h-9 flex-1 md:flex-initial md:w-40 rounded-md" />
            <Skeleton className="h-9 flex-1 md:flex-initial md:w-32 rounded-md" />
        </div>
    );
}