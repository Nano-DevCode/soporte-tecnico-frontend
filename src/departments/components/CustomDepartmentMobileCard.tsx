import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Layers } from "lucide-react";
import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Department } from "../interfaces/department.interface";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/auth/store/auth.store";


interface Props {
  departments: Department[];
  handleDownClick: (department: Department) => void;
}

export const CustomDepartmentMobileCard = memo(({ departments, handleDownClick }: Props) => {
  const { t } = useTranslation();
  const isVisitor = useAuthStore((state) => state.isVisitor);
  const getPriorityBadge = (priority?: number) => {
    switch (priority) {
      case 1:
        return { 
          label: t("departments.components.customDepartmentForm.priorityCritical"), 
          className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
        };
      case 2:
        return { 
          label: t("departments.components.customDepartmentForm.priorityHigh"), 
          className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" 
        };
      case 3:
        return { 
          label: t("departments.components.customDepartmentForm.priorityMedium"), 
          className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400" 
        };
      case 4:
        return { 
          label: t("departments.components.customDepartmentForm.priorityLow"), 
          className: "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400" 
        };
      default:
        return { 
          label: "N/A", 
          className: "bg-secondary text-secondary-foreground" 
        };
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {departments.map((department) => {
        const priorityBadge = getPriorityBadge(Number(department.priority));

        return (
          <div
            key={department.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
          >
            <Avatar className="mt-0.5 h-10 w-10 shrink-0 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                {department.acronym 
                  ? department.acronym.substring(0, 3) 
                  : department.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {department.acronym || t("departments.components.customDepartmentMobileCard.notAvailableAcronym")}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                  {t("departments.components.customDepartmentMobileCard.id")} {department.id}
                </span>
              </div>

              <p className="text-sm font-bold text-foreground leading-snug whitespace-normal wrap-break-word">
                {department.name}
              </p>

              {department.priority && (
                <div className="flex items-start gap-1.5 text-xs">
                  <Layers className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                  <span className={cn("px-1.5 rounded-sm font-semibold", priorityBadge.className)}>
                    {priorityBadge.label}
                  </span>
                </div>
              )}

              <div className="pt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-semibold text-[10px] px-2 py-0 rounded-full border-none", 
                    department.status === true 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                      : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                  )}
                >
                  {department.status === true 
                    ? t("departments.components.customDepartmentMobileCard.active") 
                    : t("departments.components.customDepartmentMobileCard.inactive")}
                </Badge>
              </div>
            </div>

            <div className="shrink-0">
              <CustomDepartmentActionsMenu 
                department={department} 
                handleDownClick={handleDownClick} 
                disable={isVisitor()}
              />
            </div>
          </div>
        );
      })}

      {departments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {t("departments.components.customDepartmentMobileCard.notFound")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70 text-center px-4">
            {t("departments.components.customDepartmentMobileCard.notFoundDescription")}
          </p>
        </div>
      )}
    </div>
  )
});