import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TicketTimeLineSkeleton = () => {
    const { t } = useTranslation();
    const skeletonItems = Array.from({ length: 3 });

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    icon={History}
                    title={t('tickets.view_page.timeline.title')}
                    description={t('tickets.view_page.timeline.description')}
                />
            </CardHeader>

            <Separator />

            <CardContent >
                {skeletonItems.map((_, idx) => {
                    const isLastItem = idx === skeletonItems.length - 1;

                    return (
                        <div key={idx} className="relative flex gap-4">

                            {!isLastItem && (
                                <div className="absolute left-4.5 sm:left-5 top-9 bottom-0 w-px bg-muted -ml-px" />
                            )}

                            <Skeleton className="relative z-10 h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-10" />

                            <div className={cn("flex flex-col min-w-0 gap-2", !isLastItem && "pb-8")}>
                                <Skeleton className="h-4 w-32 mt-0.5" />

                                <div className="flex items-center gap-1.5 mt-1">
                                    <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
                                    <Skeleton className="h-3 w-40 sm:w-48" />
                                </div>
                            </div>

                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};