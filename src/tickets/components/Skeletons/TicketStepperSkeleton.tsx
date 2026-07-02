import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface TicketStepperSkeletonProps {
    className?: string;
}

export function TicketStepperSkeleton({ className }: TicketStepperSkeletonProps) {
    const skeletonSteps = Array.from({ length: 8 }, () => uuidv4());

    return (
        <Card className={cn('w-full', className)}>
            <CardContent>
                <div className="relative">
                    <Skeleton className="absolute top-5 left-0 right-0 h-1 rounded-full" />

                    <div className="relative flex justify-between">
                        {skeletonSteps.map((stepId) => (
                            <div key={stepId} className="flex flex-col items-center gap-3 min-w-17.5 flex-1">

                                <Skeleton className="h-10 w-10 rounded-full relative z-10 shrink-0 border-2 border-transparent" />

                                <Skeleton className="h-3 w-14 sm:w-20 rounded-md" />

                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}