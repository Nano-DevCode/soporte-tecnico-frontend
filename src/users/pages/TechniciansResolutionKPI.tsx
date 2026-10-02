import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomTitleCard } from "@/components/custom/CustomTitleCard"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, CheckCircle2, Clock3, Mail, TicketCheck, Users, TrendingUp, Timer, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTechniciansResolution } from "../hooks/useTechniciansResolution"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router"
import { CustomKpiFilters } from "../components/CustomKpiFilters"
import { useTranslation } from "react-i18next"
import { getEffectivenessTone, getPendingTone, getResolvedTone, getTimeTone } from "../util/toneKPI"
import type { MetricProps } from "../interfaces/kpis"

const TechniciansResolutionKPI = () => {
  const { t } = useTranslation();
  const { staffs, meta, isLoading: skeletonLoading } = useTechniciansResolution();
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <CustomTitleCard
        icon={BarChart3}
        title={t("users.pages.techniciansResolutionKpiPage.title")}
        description={t("users.pages.techniciansResolutionKpiPage.description")}
      />

      <CustomKpiFilters />

      {skeletonLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse border-muted/60 shadow-sm">
              <CardHeader className="gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted/80 shrink-0" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted/60" />
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted/50 mt-2" />
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((__, metricIndex) => (
                  <div key={metricIndex} className="h-16 rounded-xl bg-muted/40" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : staffs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-20 text-center animate-in fade-in duration-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/60 mb-4">
            <FilterX className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{t("users.pages.techniciansResolutionKpiPage.emptyState.title")}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
            {t("users.pages.techniciansResolutionKpiPage.emptyState.description")}
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setSearchParams({})}
          >
            {t("users.pages.techniciansResolutionKpiPage.emptyState.clearFilters")}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {staffs.map((staff) => {
              const effectiveness = Math.min(Math.max(staff.metrics.effectivenessRate, 0), 100);
              const effectivenessTone = getEffectivenessTone(effectiveness, t);
              const pendingTone = getPendingTone(staff.metrics.pendingTickets, t);
              const resolvedTone = getResolvedTone(staff.metrics.totalAssigned, staff.metrics.totalResolved, t);
              const timeTone = getTimeTone(staff.metrics.avgResolutionHours, t);

              return (
                <Card key={staff.id} className={cn(
                  "overflow-hidden border-l-[5px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-linear-to-br from-background to-muted/20 w-full min-w-0 p-4 sm:p-5",
                  effectivenessTone.border
                )}>
                  <CardHeader className="gap-3.5 p-0 pb-4 min-w-0 w-full">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className={cn(
                        "flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full text-sm sm:text-[15px] font-bold shadow-sm ring-4 ring-background",
                        effectivenessTone.avatar
                      )}>
                        {staff.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1.5 min-w-0">
                          <h3 className="truncate font-bold tracking-tight text-foreground/90 text-sm sm:text-base min-w-0" title={staff.fullName}>
                            {staff.fullName}
                          </h3>
                          <Badge className={cn("text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-semibold shadow-none border shrink-0", effectivenessTone.badge)}>
                            {effectivenessTone.label}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-muted-foreground/80 min-w-0">
                          <span className="inline-flex items-center gap-1.5 font-medium truncate">
                            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{staff.numControl}</span>
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{staff.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contenedor de la barra de progreso optimizado para móvil */}
                    <div className="w-full min-w-0 space-y-1.5 pt-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                          <span className="truncate">{t("users.pages.techniciansResolutionKpiPage.card.effectivenessRate")}</span>
                        </span>
                        <span className={cn("shrink-0 font-black text-sm sm:text-[15px] tabular-nums", effectivenessTone.text)}>
                          {effectiveness.toFixed(0)}%
                        </span>
                      </div>
                      <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-muted/70 shadow-inner [clip-path:inset(0_round_9999px)]">
                        <div 
                          role="progressbar"
                          aria-valuenow={effectiveness}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out shadow-xs",
                            effectivenessTone.bar || (effectivenessTone.progress.includes("emerald") ? "bg-emerald-500 dark:bg-emerald-400" : effectivenessTone.progress.includes("amber") ? "bg-amber-500 dark:bg-amber-400" : "bg-rose-500 dark:bg-rose-400")
                          )}
                          style={{ width: `${effectiveness}%` }}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-2 sm:gap-3 p-0 min-w-0">
                    <Metric icon={TicketCheck} label={t("users.pages.techniciansResolutionKpiPage.card.metrics.assigned")} value={staff.metrics.totalAssigned} />
                    <Metric icon={CheckCircle2} label={t("users.pages.techniciansResolutionKpiPage.card.metrics.resolved")} value={staff.metrics.totalResolved} tone={resolvedTone} />
                    <Metric icon={Clock3} label={t("users.pages.techniciansResolutionKpiPage.card.metrics.pending")} value={staff.metrics.pendingTickets} tone={pendingTone} />
                    <Metric 
                      icon={Timer} 
                      label={t("users.pages.techniciansResolutionKpiPage.card.metrics.avgTime")} 
                      value={`${staff.metrics.avgResolutionHours}h`} 
                      tone={timeTone} 
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="pt-2">
            <CustomPagination totalPages={meta?.lastPage ?? 0} />
          </div>
        </>
      )}
    </div>
  )
}

const Metric = ({ icon: Icon, label, value, tone }: MetricProps) => (
  <div className={cn(
    "rounded-xl border p-2.5 sm:p-3 transition-colors duration-200 hover:bg-opacity-80 min-w-0 overflow-hidden", 
    tone?.surface ?? "border-border/60 bg-muted/20"
  )}>
    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider min-w-0">
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="truncate">{label}</span>
    </div>
    <p className={cn("mt-1 text-lg sm:text-xl font-black tracking-tight truncate", tone?.text)}>{value}</p>
  </div>
);



export default TechniciansResolutionKPI;