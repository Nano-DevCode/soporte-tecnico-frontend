import { useTranslation } from "react-i18next";
import { Smile, Star, Users, AlertCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserSatisfactionData } from "../interfaces/user-satisfaction.interface";
import { cn } from "@/lib/utils";

interface UserSatisfactionCardProps {
    data?: UserSatisfactionData;
    isLoading: boolean;
}

export const UserSatisfactionCard = ({ data: metrics, isLoading }: UserSatisfactionCardProps) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Card className="flex flex-col justify-between h-full">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!metrics) {
        return (
            <Card className="flex flex-col justify-center items-center h-full min-h-62.5 text-center p-6">
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                <CardTitle className="text-base">
                    {t("dashboards.metrics.satisfaction.empty.title")}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                    {t("dashboards.metrics.satisfaction.empty.description")}
                </CardDescription>
            </Card>
        );
    }

    const { success, value, meta, details } = metrics;

    return (
        <Card className="flex flex-col h-100% w-full lg:max-w-120">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Smile className="w-5 h-5" />
                        {t("dashboards.metrics.satisfaction.title")}
                    </CardTitle>
                </div>
                <CardDescription>
                    {t("dashboards.metrics.satisfaction.description")}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* KPI Principal */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <span className={cn("text-4xl font-bold tracking-tight",
                            success
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400"
                        )}>
                            {value}%
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("dashboards.metrics.satisfaction.goal")}: {meta}%
                        </span>
                    </div>
                    <Progress value={value} className={cn("h-2.5",
                        success
                            ? "bg-emerald-100 [&>div]:bg-emerald-600 dark:bg-emerald-950/50 dark:[&>div]:bg-emerald-500"
                            : "bg-red-100 [&>div]:bg-red-600 dark:bg-red-950/50 dark:[&>div]:bg-red-500"
                    )} />
                </div>

                {/* Sub-métricas Secundarias */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Star className="w-4 h-4 fill-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("dashboards.metrics.satisfaction.avg_score_label")}
                            </p>
                            <p className="font-semibold">{details.averageScore} / 5.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("dashboards.metrics.satisfaction.surveys_label")}
                            </p>
                            <p className="font-semibold">
                                {t("dashboards.metrics.satisfaction.surveys_count", {
                                    count: details.totalSurveys,
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desglose de preguntas individuales */}
                {details.questionBreakdown && details.questionBreakdown.length > 0 && (
                    <div className="pt-3 border-t space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {t("dashboards.metrics.satisfaction.breakdown_title")}
                        </p>
                        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                            {details.questionBreakdown.map((q) => {
                                const percentage = (q.average / 5) * 100;

                                return (
                                    <div key={q.questionId} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span
                                                className="font-medium truncate max-w-[75%]"
                                                title={q.questionText}
                                            >
                                                {q.questionText}
                                            </span>
                                            <span className="font-semibold text-muted-foreground">
                                                {q.average} / 5.0
                                            </span>
                                        </div>
                                        <Progress value={percentage} className="h-1.5" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};