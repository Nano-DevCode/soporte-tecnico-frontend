import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ResolutionTimeResponse } from "../interfaces/ResolutionTimeByPriority";

interface Props {
    response: ResolutionTimeResponse;
    isLoading?: boolean;
}

export const ResolutionTimeChart = ({ response, isLoading }: Props) => {
    const { t } = useTranslation();

    const chartConfig = {
        priority_1: { label: t('dashboards.metrics.resolution_time.priority_1'), color: "hsl(var(--destructive))" },
        priority_2: { label: t('dashboards.metrics.resolution_time.priority_2'), color: "hsl(var(--chart-1))" },
        priority_3: { label: t('dashboards.metrics.resolution_time.priority_3'), color: "hsl(var(--chart-2))" },
        priority_4: { label: t('dashboards.metrics.resolution_time.priority_4'), color: "hsl(var(--chart-3))" },
    } satisfies ChartConfig;

    const transformedData = useMemo(() => {
        const map = new Map();
        response?.data?.forEach(({ month, priority, avg_hours }) => {
            if (!map.has(month)) map.set(month, { month: month.substring(5) });
            map.get(month)[`priority_${priority}`] = avg_hours;
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
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <BarChart data={transformedData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        {/* Metas sugeridas */}
                        <ReferenceLine y={12} stroke="green" strokeDasharray="3 3" label="12h" />
                        <ReferenceLine y={48} stroke="orange" strokeDasharray="3 3" label="48h" />

                        <Bar dataKey="priority_1" fill="var(--color-priority_1)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="priority_2" fill="var(--color-priority_2)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="priority_3" fill="var(--color-priority_3)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="priority_4" fill="var(--color-priority_4)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};