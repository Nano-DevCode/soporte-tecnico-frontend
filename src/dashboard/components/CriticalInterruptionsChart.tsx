import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import type { CriticalInterruptionsResponse } from "../interfaces/critical-interruptions";
import { lazy, Suspense } from "react";
const ChartContent = lazy(() => import("./CriticalInterruptionsChartContent").then(m => ({ default: m.CriticalInterruptionsChartContent })));

interface Props {
    response: CriticalInterruptionsResponse;
    isLoading?: boolean;
}

export const CriticalInterruptionsChart = ({ response, isLoading }: Props) => {
    const { t, i18n } = useTranslation();

    const chartConfig = {
        count: {
            label: t('dashboards.metrics.critical_interruptions.bar_label'),
            color: "var(--priority-1)"
        },
    } satisfies ChartConfig;

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader className="space-y-2">
                    <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent className="h-75 flex items-end gap-2 px-6 pb-6">
                    <div className="h-[20%] w-full animate-pulse rounded bg-muted/60" />
                    <div className="h-[50%] w-full animate-pulse rounded bg-muted/60" />
                    <div className="h-[40%] w-full animate-pulse rounded bg-muted/60" />
                    <div className="h-[80%] w-full animate-pulse rounded bg-muted/60" />
                </CardContent>
            </Card>
        );
    }

    const data = response?.data || [];

    const formatXAxis = (monthStr: string): string => {
        try {
            const [year, month] = monthStr.split('-');
            const date = new Date(Number(year), Number(month) - 1, 1);
            return date.toLocaleDateString(i18n.language, { month: 'short', year: 'numeric' });
        } catch {
            return monthStr;
        }
    };

    return (
        <Card className="w-full min-w-0">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    {t('dashboards.metrics.critical_interruptions.title')}
                </CardTitle>
                <CardDescription>
                    {t('dashboards.metrics.critical_interruptions.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-75 flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                        <p className="text-sm">
                            {t('dashboards.metrics.critical_interruptions.empty')}
                        </p>
                    </div>
                ) : (
                    <Suspense fallback={<div className="h-75 w-full animate-pulse bg-muted rounded-lg" />}>
                        <ChartContent
                            data={data}
                            chartConfig={chartConfig}
                            formatXAxis={formatXAxis}
                        />
                    </Suspense>
                )}
            </CardContent>
        </Card>
    );
};