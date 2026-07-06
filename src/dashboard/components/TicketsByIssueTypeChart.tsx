import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import type { IssueTypeDistributionItem } from "../interfaces/count-tickets";

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
            <CardContent>
                <ChartContainer config={chartConfig} className="h-70 w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="issueTypeName"
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            tickFormatter={(value) => (value.length > 15 ? `${value.slice(0, 15)}...` : value)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};