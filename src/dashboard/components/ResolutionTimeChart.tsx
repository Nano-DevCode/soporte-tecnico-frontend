import { lazy, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import type { ResolutionTimeResponse, TransformedResolutionData } from "../interfaces/ResolutionTimeByPriority";
const ResolutionTimeChartContent = lazy(() => import("./ResolutionTimeChartContent").then(m => ({ default: m.ResolutionTimeChartContent })));

interface Props {
    response: ResolutionTimeResponse;
    isLoading?: boolean;
}

export const ResolutionTimeChart = ({ response, isLoading }: Props) => {
    const { t } = useTranslation();

    const chartConfig = {
        priority_1: {
            label: t('dashboards.metrics.resolution_time.priority_1'),
            color: "var(--priority-1)"
        },
        priority_2: {
            label: t('dashboards.metrics.resolution_time.priority_2'),
            color: "var(--priority-2)"
        },
        priority_3: {
            label: t('dashboards.metrics.resolution_time.priority_3'),
            color: "var(--priority-3)"
        },
        priority_4: {
            label: t('dashboards.metrics.resolution_time.priority_4'),
            color: "var(--priority-4)"
        },
    } satisfies ChartConfig;

    const transformedData = useMemo(() => {
        const map = new Map<string, TransformedResolutionData>();
        response?.data?.forEach(({ month, priority, avg_hours }) => {
            if (!map.has(month)) map.set(month, { month: month.substring(5) });
            map.get(month)![`priority_${priority}`] = avg_hours;
        });
        return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
    }, [response]);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-75 flex items-end gap-4 p-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex h-full w-full items-end gap-1">
                            <div className="h-[40%] w-full animate-pulse rounded-t bg-muted/50" />
                            <div className="h-[60%] w-full animate-pulse rounded-t bg-muted/50" />
                            <div className="h-[30%] w-full animate-pulse rounded-t bg-muted/50" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full min-w-0">
            <CardHeader>
                <CardTitle>{t('dashboards.metrics.resolution_time.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<div className="h-75 w-full animate-pulse bg-muted rounded-lg" />}>
                    <ResolutionTimeChartContent chartConfig={chartConfig} transformedData={transformedData} />
                </Suspense>
            </CardContent>
        </Card>
    );
};