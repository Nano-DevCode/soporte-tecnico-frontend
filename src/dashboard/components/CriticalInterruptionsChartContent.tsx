const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { CriticalInterruptionData } from "../interfaces/critical-interruptions";
import { lazy } from "react";

interface Props {
	data: CriticalInterruptionData[],
	chartConfig: ChartConfig,
	formatXAxis: (monthStr: string) => string,
}

const DEFAULT_RADIUS: [number, number, number, number] = [10, 10, 0, 0];

export const CriticalInterruptionsChartContent = ({ data, chartConfig, formatXAxis }: Props) => {
	return (
		<ChartContainer config={chartConfig} className="h-75 w-full">
			<BarChart
				accessibilityLayer
				data={data}
				margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
			>
				<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
				<XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={10}
					className="text-xs fill-muted-foreground font-medium"
					tickFormatter={formatXAxis}
				/>
				<YAxis
					tickLine={false}
					axisLine={false}
					tickMargin={10}
					className="text-xs fill-muted-foreground font-medium"
					allowDecimals={false}
				/>
				<ChartTooltip
					cursor={{ fill: "var(--background)", opacity: 0.2 }}
					content={
						<ChartTooltipContent
							labelFormatter={(value) => formatXAxis(String(value))}
						/>
					}
				/>
				<Bar
					dataKey="count"
					fill="var(--color-count)"
					radius={DEFAULT_RADIUS}
					maxBarSize={50}
				/>
			</BarChart>
		</ChartContainer>
	);
};