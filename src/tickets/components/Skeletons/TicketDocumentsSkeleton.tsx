import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TicketDocumentsSkeleton = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.view_page.documents.title')}
                    description={t('tickets.view_page.documents.description')}
                    icon={FileDown}
                />
            </CardHeader>

            <Separator />

            <CardContent className="space-y-3">
                <Skeleton className="h-9 w-full rounded-md" />

                <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
        </Card>
    );
};