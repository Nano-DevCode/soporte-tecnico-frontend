import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Flag } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FinishTicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.finish.header.title')}
                    description={t('tickets.form.finish.header.description')}
                    icon={Flag}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-24 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-24 w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Skeleton className="h-9 w-full sm:w-25" />
                <Skeleton className="h-9 w-full sm:w-27.5" />
                <Skeleton className="h-9 w-full sm:w-35" />
            </CardFooter>
        </Card>
    );
};