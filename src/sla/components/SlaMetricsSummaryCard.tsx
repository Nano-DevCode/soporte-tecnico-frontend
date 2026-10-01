import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, CheckCircle2, AlertTriangle, AlertOctagon, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import type { SlaMetricsResponse } from "../interfaces/sla.interfaces";
import { useEvaluateSla } from "../hooks/useSlaMonitoring";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Props {
  metrics: SlaMetricsResponse | undefined;
  isLoading: boolean;
  canEvaluate?: boolean;
}

export const SlaMetricsSummaryCard = ({ metrics, isLoading, canEvaluate = true }: Props) => {
  const { t } = useTranslation();
  const { mutate: evaluateSla, isPending: isEvaluating } = useEvaluateSla();

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 bg-muted/40" />
        ))}
      </div>
    );
  }

  const { totalActive, onTrack, atRisk, breached, compliancePercentage, byPriority } = metrics;

  return (
    <div className="space-y-4">
      {/* Tarjetas Principales de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumplimiento Global */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("sla.metrics.compliance_rate", "Cumplimiento de SLA")}
            </CardTitle>
            <ShieldCheck
              className={cn(
                "h-4 w-4",
                compliancePercentage >= 90 ? "text-emerald-500" : "text-amber-500"
              )}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {compliancePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("sla.metrics.active_total", "{{count}} tickets activos evaluados", {
                count: totalActive,
              })}
            </p>
          </CardContent>
        </Card>

        {/* En Plazo */}
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("sla.metrics.on_track", "En Plazo")}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {onTrack}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("sla.metrics.on_track_desc", "< 75% del tiempo consumido")}
            </p>
          </CardContent>
        </Card>

        {/* En Riesgo */}
        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("sla.metrics.at_risk", "En Riesgo")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {atRisk}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("sla.metrics.at_risk_desc", "75% - 100% de tiempo consumido")}
            </p>
          </CardContent>
        </Card>

        {/* Vencidos */}
        <Card className="shadow-sm border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("sla.metrics.breached", "Vencidos")}
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {breached}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("sla.metrics.breached_desc", "Plazo de resolución excedido")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Desglose por Prioridad y Botón de Evaluación Manual */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" />
              {t("sla.metrics.by_priority", "Por prioridad:")}
            </span>
            {byPriority?.map((p) => (
              <div
                key={p.priority}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/50 border text-xs"
              >
                <span className="font-medium">{p.label}:</span>
                <span className="text-muted-foreground">{p.total} total</span>
                {p.atRisk > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    ({p.atRisk} riesgo)
                  </span>
                )}
                {p.breached > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    ({p.breached} vencidos)
                  </span>
                )}
              </div>
            ))}
          </div>

          {canEvaluate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => evaluateSla()}
              disabled={isEvaluating}
              className="gap-2 shrink-0 self-end md:self-auto"
            >
              {isEvaluating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t("sla.evaluate.button", "Evaluar SLA ahora")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

