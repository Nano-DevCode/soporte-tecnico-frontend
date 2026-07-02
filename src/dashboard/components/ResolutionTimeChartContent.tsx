import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { lazy } from 'react';
import type { TransformedResolutionData } from '../interfaces/ResolutionTimeByPriority';

const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const ReferenceLine = lazy(() => import('recharts').then(m => ({ default: m.ReferenceLine })));

interface Props {
    chartConfig: ChartConfig,
    transformedData: TransformedResolutionData[],
}

const DEFAULT_RADIUS: [number, number, number, number] = [10, 10, 0, 0];

export const ResolutionTimeChartContent = ({ chartConfig, transformedData }: Props) => {
    return (
        <ChartContainer config={chartConfig} className="h-75 w-full">
            <BarChart data={transformedData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                <ReferenceLine y={12} stroke="green" strokeDasharray="3 3" label="12h" />
                <ReferenceLine y={48} stroke="orange" strokeDasharray="3 3" label="48h" />

                <Bar dataKey="priority_1" fill="var(--color-priority_1)" radius={DEFAULT_RADIUS} />
                <Bar dataKey="priority_2" fill="var(--color-priority_2)" radius={DEFAULT_RADIUS} />
                <Bar dataKey="priority_3" fill="var(--color-priority_3)" radius={DEFAULT_RADIUS} />
                <Bar dataKey="priority_4" fill="var(--color-priority_4)" radius={DEFAULT_RADIUS} />
            </BarChart>
        </ChartContainer>
    )
}
