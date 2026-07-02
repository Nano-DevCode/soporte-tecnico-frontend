import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Layers } from "lucide-react";
import type { Department } from "../interfaces/department.interface";
import { useTranslation } from "react-i18next";
import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/auth/store/auth.store";

interface Props {
  departments: Department[];
  handleDownClick: (dept: Department) => void;
}

export const CustomDepartmentDesktopTable = memo(({ departments, handleDownClick }: Props) => {
  const { t } = useTranslation();
  const isVisitor = useAuthStore((state) => state.isVisitor);

  const getPriorityBadge = (priority?: number) => {
    switch (priority) {
      case 1:
        return { 
          label: t("departments.components.customDepartmentForm.priorityCritical"), 
          className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/50" 
        };
      case 2:
        return { 
          label: t("departments.components.customDepartmentForm.priorityHigh"), 
          className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50" 
        };
      case 3:
        return { 
          label: t("departments.components.customDepartmentForm.priorityMedium"), 
          className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50" 
        };
      case 4:
        return { 
          label: t("departments.components.customDepartmentForm.priorityLow"), 
          className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800/50" 
        };
      default:
        return { 
          label: "N/A", 
          className: "bg-secondary text-secondary-foreground border-border" 
        };
    }
  };

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Se eliminó la cabecera de Folio */}
            <TableHead className="w-30 text-left pl-6">
              {t("departments.components.customDepartmentDesktopTable.acronym")}
            </TableHead>
            <TableHead className="w-75 text-left">
              {t("departments.components.customDepartmentDesktopTable.name")}
            </TableHead>
            <TableHead className="w-40 text-center">
              {t("departments.components.customDepartmentDesktopTable.priority")}
            </TableHead>
            <TableHead className="w-25 text-center">
              {t("departments.components.customDepartmentDesktopTable.status")}
            </TableHead>
            <TableHead className="w-20 text-center">
              {t("departments.components.customDepartmentDesktopTable.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {departments.map((dept) => {
            const priorityBadge = getPriorityBadge(Number(dept.priority));

            return (
              <TableRow key={dept.id} className="group transition-colors">
                
                {/* ACRÓNIMO (Ajustado el padding para cuadrar sin el Folio) */}
                <TableCell className="align-middle py-4 pl-6">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    {dept.acronym}
                  </span>
                </TableCell>
                
                {/* NOMBRE */}
                <TableCell className="align-middle py-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-foreground truncate max-w-70">
                      {dept.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-70">
                      {t("departments.components.customDepartmentDesktopTable.id")} {dept.id}
                    </span>
                  </div>
                </TableCell>

                {/* PRIORIDAD (Con colores dinámicos) */}
                <TableCell className="align-middle text-center py-4 text-sm">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
                    priorityBadge.className
                  )}>
                    <Layers className="h-3 w-3 opacity-60 shrink-0" />
                    {priorityBadge.label}
                  </span>
                </TableCell>
                
                {/* ESTADO */}
                <TableCell className="align-middle text-center py-4 uppercase">
                  <Badge 
                    variant={dept.status ? "default" : "destructive"}
                    className="font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                  >
                    {dept.status ? t("departments.components.customDepartmentDesktopTable.active") : t("departments.components.customDepartmentDesktopTable.inactive")}
                  </Badge>
                </TableCell>
                
                {/* ACCIONES */}
                <TableCell className="text-center align-middle py-4">
                  <div className="flex justify-center">
                    <CustomDepartmentActionsMenu 
                      department={dept} 
                      handleDownClick={handleDownClick} 
                      disable={isVisitor()}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {/* EMPTY STATE */}
          {departments.length === 0 && (
            <TableRow>
              {/* colSpan ajustado de 6 a 5 porque eliminamos la columna Folio */}
              <TableCell 
                colSpan={5} 
                className="h-75 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Building2 className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {t("departments.components.customDepartmentDesktopTable.notFound")}
                    </p>
                    <p className="text-sm">
                      {t("departments.components.customDepartmentDesktopTable.settingFilters")}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});