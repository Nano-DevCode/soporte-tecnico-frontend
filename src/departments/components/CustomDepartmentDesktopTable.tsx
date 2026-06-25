import { memo } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Layers } from "lucide-react";
import type { Department } from "../interfaces/department.interface";
import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";
import { t } from "i18next";

interface Props {
  departments: Department[];
  handleDownClick: (dept: Department) => void;
}

export const CustomDepartmentDesktopTable = memo(({ departments, handleDownClick }: Props) => {

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        {/* Cabecera limpia, sin bg-muted/50 ni íconos extra */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 items-center justify-center text-center">
              {t("custom_department_desktop_table_folio")}
            </TableHead>
            <TableHead className="w-30 text-left">
              {t("custom_department_desktop_table_acronym")}
            </TableHead>
            <TableHead className="w-75 text-left">
              {t("custom_department_desktop_table_name")}
            </TableHead>
            <TableHead className="w-30 text-center">
              {t("custom_department_desktop_table_priority")}
            </TableHead>
            <TableHead className="w-25 text-center">
              {t("custom_department_desktop_table_status")}
            </TableHead>
            <TableHead className="w-20 text-center">
              {t("custom_department_desktop_table_actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id} className="group transition-colors">
              
              {/* FOLIO */}
              <TableCell className="font-mono text-xs font-semibold text-muted-foreground align-middle text-center py-4">
                #{dept.folio}
              </TableCell>

              {/* ACRÓNIMO */}
              <TableCell className="align-middle py-4">
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
                    {t("custom_department_desktop_table_id")} {dept.id}
                  </span>
                </div>
              </TableCell>

              {/* PRIORIDAD */}
              <TableCell className="align-middle text-center py-4 text-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold border border-border">
                  <Layers className="h-3 w-3 opacity-50" />
                  {dept.priority}
                </span>
              </TableCell>
              
              {/* ESTADO */}
              <TableCell className="align-middle text-center py-4 uppercase">
                <Badge 
                  variant={dept.status ? "default" : "destructive"}
                  className="font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                >
                  {dept.status ? t("custom_department_desktop_table_active") : t("custom_department_desktop_table_inactive")}
                </Badge>
              </TableCell>
              
              {/* ACCIONES */}
              <TableCell className="text-center align-middle py-4">
                <div className="flex justify-center">
                  <CustomDepartmentActionsMenu 
                    department={dept} 
                    handleDownClick={handleDownClick} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE (Ajustado al diseño de usuarios) */}
          {departments.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="h-75 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Building2 className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {t("custom_department_desktop_table_not_found")}
                    </p>
                    <p className="text-sm">
                      {t("custom_department_desktop_table_setting_filters")}
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