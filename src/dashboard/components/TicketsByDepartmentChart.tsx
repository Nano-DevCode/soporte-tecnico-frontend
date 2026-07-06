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
import type { DepartmentDistributionItem } from "../interfaces/count-tickets";

interface TicketsByDepartmentChartProps {
    data?: DepartmentDistributionItem[];
    isLoading: boolean;
}

export const TicketsByDepartmentChart = ({ data, isLoading }: TicketsByDepartmentChartProps) => {
    const { t } = useTranslation();

    const chartConfig = {
        count: {
            label: t("dashboards.charts.common.totalTickets"),
            color: "var(--chart-1)",
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
            <CardContent>
                <ChartContainer config={chartConfig} className="h-70 w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="departmentName"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={130}
                            tickFormatter={(value) => (value.length > 18 ? `${value.slice(0, 18)}...` : value)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[0, 10, 10, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};