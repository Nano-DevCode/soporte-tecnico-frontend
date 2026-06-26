import { useTranslation } from "react-i18next";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CriticalAvailability } from "../interfaces/critical-availability";


interface Props {
    data: CriticalAvailability;
    isLoading?: boolean;
}

export const CriticalAvailabilityCard = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Card className="h-30 animate-pulse bg-muted/50" />
        );
    }

    const { value, meta } = data.data;
    const isTargetMet = value >= meta;
    const difference = Math.abs(value - meta).toFixed(2);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                    {t('dashboards.metrics.critical_availability.title')}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
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
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    {t('dashboards.metrics.critical_availability.meta_text', { meta })}
                </p>
            </CardContent>
        </Card>
    );
};