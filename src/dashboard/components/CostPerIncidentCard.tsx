import { useTranslation } from "react-i18next";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CostPerIncident } from "../interfaces/cost-per-incident";

interface Props {
    data: CostPerIncident | undefined;
    isLoading?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

export const CostPerIncidentCard = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();


    if (isLoading || !data) {
        return <Card className="h-32 animate-pulse bg-muted/50" />;
    }

    const { value, meta } = data.data;

    const isTargetMet = value <= meta;
    const difference = Math.abs(value - meta);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                    {t('dashboards.metrics.cost_per_incident.title')}
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCurrency(value)}
                </div>

                <div className="mt-1 flex items-center text-xs">
                    <span
                        className={cn(
                            "flex items-center font-medium mr-1.5",
                            isTargetMet ? "text-emerald-500" : "text-destructive"
                        )}
                    >
                        {isTargetMet ? (
                            <TrendingDown className="mr-1 h-3 w-3" />
                        ) : (
                            <TrendingUp className="mr-1 h-3 w-3" />
                        )}
                        {formatCurrency(difference)}
                    </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    {t('dashboards.metrics.cost_per_incident.meta_text', { meta: formatCurrency(meta) })}
                </p>
            </CardContent>
        </Card>
    );
};