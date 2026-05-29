import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

export const TicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.header.title')}
                    description={t('tickets.form.header.description')}
                    icon={User}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 items-start">

                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-15 w-full rounded-md" />
                    </div>

                    <div className="space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-15 w-full rounded-md" />
                    </div>

                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <Skeleton className="h-4 w-44" />
                        <Skeleton className="h-30 w-full rounded-md" />
                    </div>

                </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Skeleton className="h-10 w-full sm:w-28 rounded-md" />

                <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
            </CardFooter>
        </Card>
    );
};