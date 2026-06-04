import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash } from "lucide-react";

export const DetailHeaderTicketSkeleton = () => {
    return (
        <Card>
            <CardContent className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                    <div className="flex flex-wrap items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground/40" strokeWidth={2.5} />

                        <Skeleton className="h-7 md:h-8 w-32.5" />

                        <Skeleton className="h-6 w-45 sm:w-60" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
                        <Skeleton className="h-5 w-27.5 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                    <Skeleton className="h-5 w-17.5 rounded-md" />
                    <Skeleton className="h-5 w-25 rounded-md" />
                    <Skeleton className="h-5 w-15 rounded-md" />
                </div>

            </CardContent>
        </Card>
    );
};