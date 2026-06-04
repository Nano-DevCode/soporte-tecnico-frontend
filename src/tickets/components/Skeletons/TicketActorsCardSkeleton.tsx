import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const TicketActorsCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="gap-0">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-md" />

                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-5 pt-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-56 ml-2" />
                </div>

                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-28" />
                    <ul className="space-y-3 mt-1 ml-2">
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-4 w-52" />
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};