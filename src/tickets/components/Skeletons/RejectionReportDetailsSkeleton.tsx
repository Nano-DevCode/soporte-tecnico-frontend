import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClipboardXIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { SkeletonSectionInfo } from "@/components/custom/CustomSectionInfo";
import { SkeletonInfoRow } from "@/components/custom/CustomInfoRow";

export const RejectionReportDetailsSkeleton = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('rejection_reports.header.title')}
                    description={t('rejection_reports.header.description')}
                    icon={ClipboardXIcon}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">

                <SkeletonSectionInfo />

                <div className="grid grid-cols-1 gap-y-5">
                    <SkeletonInfoRow />
                    <SkeletonInfoRow isDescription />
                </div>

            </CardContent>
        </Card>
    );
};