import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AuditActionType } from "../interfaces/audit.interfaces";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

interface Props {
  action: AuditActionType;
  className?: string;
}

export const AuditActionBadge = ({ action, className }: Props) => {
  const config = {
    CREATE: {
      label: "CREACIÓN",
      icon: PlusCircle,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dotClass: "bg-emerald-500",
    },
    UPDATE: {
      label: "MODIFICACIÓN",
      icon: Edit3,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dotClass: "bg-amber-500",
    },
    DELETE: {
      label: "ELIMINACIÓN",
      icon: Trash2,
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      dotClass: "bg-rose-500",
    },
  }[action] || {
    label: action,
    icon: Edit3,
    badgeClass: "bg-muted text-muted-foreground",
    dotClass: "bg-muted-foreground",
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border shadow-none",
        config.badgeClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

