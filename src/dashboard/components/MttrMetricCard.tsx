import { useTranslation } from "react-i18next";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MTTRResponse } from "../interfaces/MTTR";

interface Props {
    data: MTTRResponse;
    isLoading?: boolean;
}

export const MttrMetricCard = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();

    if (isLoading || !data) {
        return (
            <Card className="h-32 animate-pulse bg-muted/50" />
        );
    }

    // Extraemos la nueva estructura (asegúrate de acceder a data.data según tu interfaz)
    const { value, comparison } = data.data;
    const { isImproved, difference, previousValue } = comparison;

    // Usamos valor absoluto para no mostrar doble negativo (ej. ↓ -1.5)
    const formattedDifference = Math.abs(difference).toFixed(2);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                    {t('dashboards.metrics.mttr.title')}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{t('dashboards.metrics.mttr.hours_suffix')}</span>
                </div>

                <div className="mt-1 flex items-center text-xs">
                    <span
                        className={cn(
                            "flex items-center font-medium mr-1.5",
                            // Si isImproved es true (el tiempo bajó), es éxito (verde)
                            isImproved ? "text-emerald-500" : "text-destructive"
                        )}
                    >
                        {isImproved ? (
                            <TrendingDown className="mr-1 h-3 w-3" /> // Flecha abajo = logramos resolver más rápido
                        ) : (
                            <TrendingUp className="mr-1 h-3 w-3" />   // Flecha arriba = nos tardamos más
                        )}
                        {formattedDifference} {t('dashboards.metrics.mttr.hours_suffix')}
                    </span>
                    <span className="text-muted-foreground">
                        {t('dashboards.metrics.mttr.vs_previous')}
                    </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    {/* Texto: "El MTTR anterior fue de {previous} hrs" */}
                    {t('dashboards.metrics.mttr.previous_period', { previous: previousValue.toFixed(2) })}
                </p>
            </CardContent>
        </Card>
    );
};