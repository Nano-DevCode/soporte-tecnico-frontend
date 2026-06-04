import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

export const RouteTicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.route.header.title')}
                    description={t('tickets.form.route.header.description')}
                    icon={Send}
                />
            </CardHeader>

            <Separator />

            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-30" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-37.5" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Skeleton className="h-9 w-full sm:w-25" />
                <Skeleton className="h-9 w-full sm:w-25" />
                <Skeleton className="h-9 w-full sm:w-30" />
            </CardFooter>
        </Card>
    );
};