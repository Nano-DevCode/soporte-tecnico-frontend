import { lazy, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ResolutionTimeResponse, TransformedResolutionData } from "../interfaces/ResolutionTimeByPriority";
const LazyRechartsContent = lazy(() =>
    import("recharts").then((module) => {
        const { BarChart, Cell, Bar, CartesianGrid, XAxis, YAxis, ReferenceLine } = module;
        const DEFAULT_RADIUS: [number, number, number, number] | number = 5;

        return {
            default: ({ transformedData, chartConfig, xlabel, ylabel, goals }: { transformedData: TransformedResolutionData[], chartConfig: ChartConfig, xlabel: string, ylabel: string, goals: { [key: string]: number } }) => (
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={transformedData}
                        accessibilityLayer
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="priorityLabel"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            label={{
                                value: xlabel,
                                position: 'insideBottom',
                                offset: -15,
                                className: "fill-muted-foreground text-xs font-semibold"
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            label={{
                                value: ylabel,
                                angle: -90,
                                position: 'insideLeft',
                                offset: 15,
                                className: "fill-muted-foreground text-xs font-semibold"
                            }}
                        />
                        <ChartTooltip
                            cursor={{ fill: "var(--background)", opacity: 0.2 }}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        {Object.entries(goals).map(([priority, limit]) => (
                            <ReferenceLine
                                key={`goal-${priority}`}
                                y={limit}
                                stroke={`var(--color-priority_${priority})`}
                                strokeDasharray="3 3"
                                label={{
                                    position: "right",
                                    value: `${limit}h`,
                                    fill: `var(--color-priority_${priority})`,
                                    fontSize: 12,
                                    fontWeight: 600
                                }}
                            />
                        ))}

                        <Bar dataKey="avg_hours" radius={DEFAULT_RADIUS} maxBarSize={80}>
                            {transformedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            )
        };
    })
);
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
        return response?.data?.map((item) => ({
            priorityLabel: t(`tickets.priority.${item.priority}.name`),
            avg_hours: item.avg_hours,
            fill: `var(--color-priority_${item.priority})`,
        })) || [];
    }, [response, t]);

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
            <CardContent className="h-full">
                <Suspense fallback={<div className="h-75 w-full animate-pulse bg-muted rounded-lg" />}>
                    <LazyRechartsContent
                        chartConfig={chartConfig}
                        transformedData={transformedData}
                        xlabel={t('dashboards.metrics.resolution_time.xlabel')}
                        ylabel={t('dashboards.metrics.resolution_time.ylabel')}
                        goals={response?.goals || {}}
                    />
                </Suspense>
            </CardContent>
        </Card>
    );
};