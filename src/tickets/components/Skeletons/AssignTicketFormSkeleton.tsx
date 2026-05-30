import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

export const AssignTicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.assign.header.title')}
                    description={t('tickets.form.assign.header.description')}
                    icon={UserPlus}
                />
            </CardHeader>
            <Separator />

            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-32" />

                <Skeleton className="h-10 w-full rounded-md" />

                <div className="flex justify-end">
                    <Skeleton className="h-3 w-24" />
                </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Skeleton className="h-10 flex-auto sm:flex-none sm:w-28 rounded-md" />

                <Skeleton className="h-10 flex-auto sm:flex-none sm:w-40 rounded-md" />
            </CardFooter>
        </Card>
    );
};