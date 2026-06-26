import { useTranslation } from "react-i18next";
import { ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MaintenanceCompliance } from "../interfaces/maintaince-compliance";

interface Props {
    data: MaintenanceCompliance | undefined;
    isLoading?: boolean;
}

export const MaintenanceCard = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();

    if (isLoading || !data) {
        return <Card className="h-32 animate-pulse bg-muted/50" />;
    }

    const { value, meta } = data.data;

    // Éxito: 100% es la meta. Si estamos en 100, es éxito.
    const isTargetMet = value >= meta;
    const difference = Math.abs(value - meta).toFixed(2);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                    {t('dashboards.metrics.maintenance.title')}
                </CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value.toFixed(2)}%
                </div>

                <div className="mt-1 flex items-center text-xs">
                    <span
                        className={cn(
                            "flex items-center font-medium mr-1.5",
                            isTargetMet ? "text-emerald-500" : "text-destructive"
                        )}
                    >
                        {isTargetMet ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {difference}%
                    </span>
                    {/* <span className="text-muted-foreground">
                        {isTargetMet
                            ? t('dashboards.metrics.maintenance.at_target')
                            : t('dashboards.metrics.maintenance.below_target')}
                    </span> */}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    {t('dashboards.metrics.maintenance.meta_text', { meta })}
                </p>

            </CardContent>
        </Card>
    );
};