import { useTranslation } from "react-i18next";
import { lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import type { DepartmentDistributionItem } from "../interfaces/count-tickets";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomYAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
        value: string;
    };
}

const CustomYAxisTick = (props: CustomYAxisTickProps) => {
    const { x = 0, y = 0, payload } = props;

    if (!payload || !payload.value) return null;

    const text = payload.value;
    const maxLength = 20;

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        if (lines.length >= 3) break;

        if ((currentLine + word).length > maxLength) {
            if (currentLine !== "") {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                lines.push(word.slice(0, maxLength));
                currentLine = word.slice(maxLength) + " ";
            }
        } else {
            currentLine += word + " ";
        }
    }
    if (currentLine.trim() && lines.length < 3) {
        lines.push(currentLine.trim());
    }
    if (lines.length === 3 && text.length > lines.join(" ").length + 2) {
        lines[2] = lines[2].slice(0, maxLength - 3) + "...";
    }

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                textAnchor="end"
                fill="currentColor"
                className="fill-muted-foreground text-xs"
            >
                {lines.map((line, index) => {
                    const dy = index === 0
                        ? `${0.35 - (lines.length - 1) * 0.6}em`
                        : "1.2em";

                    return (
                        <tspan key={index} x={-8} dy={dy}>
                            {line}
                        </tspan>
                    );
                })}
            </text>
        </g>
    );
};

const LazyRechartsContent = lazy(() =>
    import("recharts").then((module) => {
        const { BarChart, Bar, CartesianGrid, XAxis, YAxis } = module;
        const DEFAULT_RADIUS: [number, number, number, number] | number = 5;

        return {
            default: ({ data, chartConfig, xlabel, ylabel }: { data: DepartmentDistributionItem[], chartConfig: ChartConfig, xlabel: string, ylabel: string }) => (
                <ChartContainer config={chartConfig} className="w-full h-350">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{ top: 30, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            orientation="top"
                            label={{
                                value: xlabel,
                                position: 'top',
                                offset: 15,
                                className: "fill-muted-foreground text-xs font-semibold"
                            }}
                        />
                        <YAxis
                            dataKey="departmentName"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={115}
                            interval={0}
                            tick={<CustomYAxisTick />}
                            label={{
                                value: ylabel,
                                angle: -90,
                                position: 'insideLeft',
                                offset: -25,
                                className: "fill-muted-foreground text-xs font-semibold"
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={DEFAULT_RADIUS}
                        />
                    </BarChart>
                </ChartContainer>
            )
        };
    })
);

interface TicketsByDepartmentChartProps {
    data?: DepartmentDistributionItem[];
    isLoading: boolean;
}

export const TicketsByDepartmentChart = ({ data, isLoading }: TicketsByDepartmentChartProps) => {
    const { t } = useTranslation();

    const chartConfig = {
        count: {
            label: t("dashboards.charts.common.totalTickets"),
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig;

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-70 w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t("dashboards.charts.department.title")}</CardTitle>
                    <CardDescription>{t("dashboards.charts.department.description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex h-70 items-center justify-center text-sm text-muted-foreground">
                    {t("dashboards.common.noDataAvailable")}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("dashboards.charts.department.title")}</CardTitle>
                <CardDescription>{t("dashboards.charts.department.description")}</CardDescription>
            </CardHeader>
            <CardContent >
                <Suspense fallback={<Skeleton className="h-70 w-full rounded-md" />}>
                    <ScrollArea className="h-70 [&>div>div[style]]:block!">
                        <LazyRechartsContent
                            data={data}
                            chartConfig={chartConfig}
                            xlabel={t('dashboards.charts.department.xlabel')}
                            ylabel={t('dashboards.charts.department.ylabel')}
                        />
                    </ScrollArea>
                </Suspense>
            </CardContent>
        </Card>
    );
};