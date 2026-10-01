import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SlaStatusType } from "../interfaces/sla.interfaces";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertTriangle, AlertOctagon, Check } from "lucide-react";

interface Props {
  status: SlaStatusType;
  className?: string;
}

export const SlaStatusBadge = ({ status, className }: Props) => {
  const { t } = useTranslation();

  const config = {
    ON_TRACK: {
      label: t("sla.status.on_track", "En Plazo"),
      icon: CheckCircle2,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dotClass: "bg-emerald-500",
    },
    AT_RISK: {
      label: t("sla.status.at_risk", "En Riesgo"),
      icon: AlertTriangle,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dotClass: "bg-amber-500 animate-pulse",
    },
    BREACHED: {
      label: t("sla.status.breached", "Vencido"),
      icon: AlertOctagon,
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      dotClass: "bg-rose-500",
    },
    COMPLIANT: {
      label: t("sla.status.compliant", "Cumplido"),
      icon: Check,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      dotClass: "bg-blue-500",
    },
  }[status] || {
    label: status,
    icon: CheckCircle2,
    badgeClass: "bg-muted text-muted-foreground",
    dotClass: "bg-muted-foreground",
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-none",
        config.badgeClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
};

