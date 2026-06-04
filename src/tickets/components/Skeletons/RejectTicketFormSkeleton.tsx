import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

export const RejectTicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.reject.header.title')}
                    description={t('tickets.form.reject.header.description')}
                    icon={XCircle}
                />
            </CardHeader>

            <Separator />

            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-35" />
                        <Skeleton className="h-32 w-full rounded-md" />
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