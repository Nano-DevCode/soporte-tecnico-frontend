import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

export const TechnicalReportsAccordionSkeleton = () => {
    const { t } = useTranslation();
    const skeletonItems = Array.from({ length: 2 }, () => uuidv4());

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.view_page.technical_reports.title')}
                    description={t('tickets.view_page.technical_reports.description')}
                    icon={PenTool}
                />
            </CardHeader>

            <Separator />

            <CardContent >
                <div className="w-full space-y-3">
                    {skeletonItems.map((id) => (
                        <div
                            key={id}
                            className="flex flex-wrap items-center justify-between w-full gap-2 border rounded-lg px-4 py-4"
                        >
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-8 rounded-full shrink-0" />
                                <div className="flex items-center gap-1.5">
                                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                                    <Skeleton className="h-4 w-32 sm:w-40" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Skeleton className="h-5 w-24 rounded-full shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};