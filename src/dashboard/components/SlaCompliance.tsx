import { useTranslation } from "react-i18next";
import { Timer, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SlaCompliance } from "../interfaces/sla-compliance";

interface Props {
    data: SlaCompliance | undefined;
    isLoading?: boolean;
}

export const SlaComplianceCard = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();

    // Mostramos el esqueleto de carga
    if (isLoading || !data) {
        return (
            <Card className="h-32 animate-pulse bg-muted/50" />
        );
    }

    const { value, meta } = data.data;

    // Éxito: Si el porcentaje es mayor o igual a la meta (>= 90%)
    const isTargetMet = value >= meta;
    const difference = Math.abs(value - meta).toFixed(2);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                    {t('dashboards.metrics.sla_compliance.title')}
                </CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
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
                            ? t('dashboards.metrics.sla_compliance.above_target')
                            : t('dashboards.metrics.sla_compliance.below_target')}
                    </span> */}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    {t('dashboards.metrics.sla_compliance.meta_text', { meta })}
                </p>

            </CardContent>
        </Card>
    );
};