import { cn } from "@/lib/utils";
import type { SlaStatusType } from "../interfaces/sla.interfaces";
import { useTranslation } from "react-i18next";

interface Props {
  percentage: number;
  remainingHours: number;
  maxHours: number;
  status: SlaStatusType;
}

export const SlaProgressBar = ({
  percentage,
  remainingHours,
  maxHours,
  status,
}: Props) => {
  const { t } = useTranslation();
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const getBarColor = () => {
    if (status === "BREACHED" || percentage >= 100) return "bg-rose-500";
    if (status === "AT_RISK" || percentage >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const formatHours = (hours: number) => {
    if (hours <= 0) return t("sla.time.overdue", "0h (Vencido)");
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">
          {percentage.toFixed(0)}%{" "}
          <span className="text-muted-foreground font-normal">
            ({t("sla.consumed", "consumido")})
          </span>
        </span>
        <span
          className={cn(
            "font-semibold",
            status === "BREACHED"
              ? "text-rose-600 dark:text-rose-400"
              : status === "AT_RISK"
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          )}
        >
          {remainingHours > 0
            ? `${formatHours(remainingHours)} ${t("sla.remaining", "restantes")}`
            : t("sla.breached_label", "Plazo excedido")}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-500", getBarColor())}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      <p className="text-[11px] text-muted-foreground text-right">
        {t("sla.max_allowed", "Límite: {{hours}}h", { hours: maxHours })}
      </p>
    </div>
  );
};

