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
import type { IssueTypeDistributionItem } from "../interfaces/count-tickets";

interface CustomXAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
        value: string;
    };
}

const CustomXAxisTick = (props: CustomXAxisTickProps) => {
    const { x, y, payload } = props;
    if (!payload || !payload.value) return null;

    const text = payload.value;

    const maxLength = 15;
    let line1 = text;
    let line2 = "";

    if (text.length > maxLength) {
        const middle = Math.floor(text.length / 2);
        const spaceIndex = text.indexOf(" ", middle - 3);

        if (spaceIndex !== -1 && spaceIndex < maxLength + 5) {
            line1 = text.slice(0, spaceIndex);
            line2 = text.slice(spaceIndex + 1);
        } else {
            line1 = text.slice(0, maxLength) + "-";
            line2 = text.slice(maxLength);
        }
    }

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                transform="rotate(-90)"
            >
                <tspan x={0} dy="0em">
                    {line1}
                </tspan>
                {line2 && (
                    <tspan x={0} dy="1.2em">
                        {line2}
                    </tspan>
                )}
            </text>
        </g>
    );
};

const LazyRechartsContent = lazy(() =>
    import("recharts").then((module) => {
        const { BarChart, Bar, CartesianGrid, XAxis, YAxis } = module;
        const DEFAULT_RADIUS: [number, number, number, number] | number = 5;

        return {
            default: ({ data, chartConfig, xlabel, ylabel }: {
                data: IssueTypeDistributionItem[],
                chartConfig: ChartConfig,
                xlabel: string,
                ylabel: string
            }) => (
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="issueTypeName"
                            tickLine={false}
                            axisLine={false}
                            height={100}
                            interval={0}
                            angle={-90}
                            textAnchor="end"
                            tick={<CustomXAxisTick />}
                            label={{
                                value: xlabel,
                                position: 'insideBottom',
                                offset: -5,
                                className: "fill-muted-foreground text-xs font-semibold"
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: ylabel,
                                angle: -90,
                                position: 'insideLeft',
                                offset: 20,
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

interface TicketsByIssueTypeChartProps {
    data?: IssueTypeDistributionItem[];
    isLoading: boolean;
}

export const TicketsByIssueTypeChart = ({ data, isLoading }: TicketsByIssueTypeChartProps) => {
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
                    <CardTitle>{t("dashboards.charts.issueType.title")}</CardTitle>
                    <CardDescription>{t("dashboards.charts.issueType.description")}</CardDescription>
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
                <CardTitle>{t("dashboards.charts.issueType.title")}</CardTitle>
                <CardDescription>{t("dashboards.charts.issueType.description")}</CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <Suspense fallback={<Skeleton className="h-70 w-full rounded-md" />}>
                    <LazyRechartsContent
                        data={data}
                        chartConfig={chartConfig}
                        xlabel={t('dashboards.charts.issueType.xlabel')}
                        ylabel={t('dashboards.charts.issueType.ylabel')}
                    />
                </Suspense>
            </CardContent>
        </Card>
    );
};