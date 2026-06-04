import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { ClipboardSignature } from "lucide-react";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

export const InterveneTicketFormSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.intervene.header.title')}
                    description={t('tickets.form.intervene.header.description')}
                    icon={ClipboardSignature}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-37.5" />
                        <Skeleton className="h-24 w-full rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-50" />
                        <Skeleton className="h-24 w-full rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-45" />
                        <Skeleton className="h-24 w-full rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-25" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-3 w-62.5" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-62.5" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-25.25 w-full rounded-md border" />
                            <Skeleton className="h-25.25 w-full rounded-md border" />
                        </div>
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