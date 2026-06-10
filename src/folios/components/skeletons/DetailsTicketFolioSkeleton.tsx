import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tickets } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { SkeletonSectionInfo } from "@/components/custom/CustomSectionInfo";
import { SkeletonInfoRow } from "@/components/custom/CustomInfoRow";

export const DetailsTicketFolioSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.header.title')}
                    description={t('tickets.form.header.description')}
                    icon={Tickets}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
                <SkeletonSectionInfo />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                    <SkeletonInfoRow />
                    <SkeletonInfoRow />
                </div>

                <Separator />

                <SkeletonSectionInfo />
                <SkeletonInfoRow />

                <Separator />

                <SkeletonSectionInfo />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5">
                    <SkeletonInfoRow />
                    <SkeletonInfoRow />
                    <SkeletonInfoRow />
                </div>

            </CardContent>
        </Card>
    );
};