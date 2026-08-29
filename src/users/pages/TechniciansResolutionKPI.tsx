import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomTitleCard } from "@/components/custom/CustomTitleCard"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle2, Clock3, Mail, TicketCheck, Users, TrendingUp, Timer, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTechniciansResolution } from "../hooks/useTechniciansResolution";
import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router"
import { CustomKpiFilters } from "../components/CustomKpiFilters"
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const TechniciansResolutionKPI = () => {
  const { t } = useTranslation();
  const { staffs, meta, isLoading: skeletonLoading } = useTechniciansResolution();
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="space-y-6">
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
                  <div className="h-12 w-12 rounded-full bg-muted/80" />
                  <div className="space-y-2 flex-1">
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
                  "overflow-hidden border-l-[5px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-linear-to-br from-background to-muted/20",
                  effectivenessTone.border
                )}>
                  <CardHeader className="gap-4 pb-5">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold shadow-sm ring-4 ring-background",
                        effectivenessTone.avatar
                      )}>
                        {staff.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-bold tracking-tight text-foreground/90" title={staff.fullName}>
                            {staff.fullName}
                          </h3>
                          <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold shadow-none border whitespace-nowrap", effectivenessTone.badge)}>
                            {effectivenessTone.label}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-muted-foreground/80">
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <Users className="h-3.5 w-3.5" />
                            {staff.numControl}
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{staff.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                          <TrendingUp className="h-4 w-4" /> {t("users.pages.techniciansResolutionKpiPage.card.effectivenessRate")}
                        </span>
                        <span className={cn("font-black text-[15px]", effectivenessTone.text)}>{effectiveness.toFixed(0)}%</span>
                      </div>
                      <Progress value={effectiveness} className={cn("h-2.5 bg-muted/60 shadow-inner", effectivenessTone.progress)} />
                    </div>
                  </CardHeader>

                  <CardContent className="grid grid-cols-2 gap-3 pt-0 pb-5">
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

interface MetricProps {
  icon: typeof TicketCheck;
  label: string;
  value: number | string;
  tone?: KpiTone;
}

interface KpiTone {
  label: string;
  border: string;
  avatar: string;
  badge: string;
  text: string;
  progress: string;
  surface: string;
}

const Metric = ({ icon: Icon, label, value, tone }: MetricProps) => (
  <div className={cn(
    "rounded-xl border p-3 transition-colors duration-200 hover:bg-opacity-80", 
    tone?.surface ?? "border-border/60 bg-muted/20"
  )}>
    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="truncate">{label}</span>
    </div>
    <p className={cn("mt-1.5 text-xl font-black tracking-tight", tone?.text)}>{value}</p>
  </div>
);

// --- Funciones de Tonalidad ---
const getEffectivenessTone = (value: number, t: TFunction): KpiTone => {
  if (value >= 80) return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.excellent"), border: "border-l-emerald-500", avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badge: "bg-emerald-100/50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-400", progress: "[&>div]:bg-emerald-500", surface: "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
  };
  if (value >= 60) return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.regular"), border: "border-l-amber-500", avatar: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    badge: "bg-amber-100/50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300", text: "text-amber-600 dark:text-amber-400", progress: "[&>div]:bg-amber-500", surface: "border-amber-200/60 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20"
  };
  return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.attention"), border: "border-l-rose-500", avatar: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    badge: "bg-rose-100/50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300", text: "text-rose-600 dark:text-rose-400", progress: "[&>div]:bg-rose-500", surface: "border-rose-200/60 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20"
  };
};

const getPendingTone = (value: number, t: TFunction): KpiTone => value === 0
  ? getEffectivenessTone(100, t)
  : value <= 2 ? getEffectivenessTone(60, t) : getEffectivenessTone(0, t);

const getResolvedTone = (assigned: number, resolved: number, t: TFunction): KpiTone =>
  getEffectivenessTone(assigned === 0 ? 100 : (resolved / assigned) * 100, t);

const getTimeTone = (hours: number, t: TFunction): KpiTone => {
  if (hours <= 24 && hours >= 0) return getEffectivenessTone(100, t); 
  if (hours <= 72) return getEffectivenessTone(60, t);
  return getEffectivenessTone(0, t);
};

export default TechniciansResolutionKPI;