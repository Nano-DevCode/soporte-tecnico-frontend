import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { CustomActionsMenuSchoolPeriod } from "./CustomActionsMenuSchoolPeriod";
import type { SchoolPeriod } from "../interfaces/school-period.interface";
import { cn } from "@/lib/utils";
import { formatPeriodType } from "../utils/format-period-type";
import { toFormatLocalDateString } from "../../lib/helpers/to-format-local-date-string";

interface Props {
  schoolPeriods: SchoolPeriod[];
  handleActivateClick: (schoolPeriod: SchoolPeriod) => void;
  handleDeactivateClick: (schoolPeriod: SchoolPeriod) => void;
  handleRowClick: (id: string) => void;
}

export const CustomDesktopTableSchoolPeriod = (
  { schoolPeriods, handleActivateClick, handleDeactivateClick, handleRowClick }: Props
) => {
  const { t, i18n } = useTranslation();

  return (
    // Quité bg-card para que herede el fondo de tu componente Table base (el que hicimos azul/oscuro)
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] items-center justify-center text-center">
              {t("custom_desktop_table_school_period_head_name")}
            </TableHead>

            <TableHead className="w-[300px] text-left">
              {t("custom_desktop_table_school_period_head_period")}
            </TableHead>

            <TableHead className="w-[300px] text-left">
              {t("custom_desktop_table_school_period_head_period_type")}
            </TableHead>

            <TableHead className="w-[280px] text-left">
              {t("custom_desktop_table_school_period_head_status")}
            </TableHead>

            <TableHead className="w-[100px] text-center">
              {t("custom_desktop_table_school_period_head_actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {schoolPeriods.map((schoolPeriod) => (
            <TableRow key={schoolPeriod.id} className="group transition-colors"
              onClick={() => handleRowClick(schoolPeriod.id)}>

              {/* NOMBRE */}
              <TableCell className="text-sm text-muted-foreground align-middle py-4">
                <div className="max-w-[280px] line-clamp-2 font-medium">
                  {schoolPeriod.name}
                </div>
              </TableCell>

              {/* PERIODO */}
              <TableCell className="text-sm text-muted-foreground align-middle py-4">
                <div className="max-w-[280px] line-clamp-2 font-medium">
                  {toFormatLocalDateString(schoolPeriod.date_start, i18n.language)}
                  -
                  {toFormatLocalDateString(schoolPeriod.date_end, i18n.language)}
                </div>
              </TableCell>

              {/* TIPO PERIODO */}
              <TableCell className="text-sm text-muted-foreground align-middle py-4">
                <div className="max-w-[280px] line-clamp-2 font-medium">
                  {formatPeriodType(schoolPeriod.period_type, t)}
                </div>
              </TableCell>

              {/* ESTADO (Usando las variantes de Shadcn) */}
              <TableCell className="align-middle py-4 uppercase">
                <Badge
                  className={cn(
                    "font-semibold px-2.5 py-0.5 rounded-full shadow-sm",
                    schoolPeriod.is_active === true
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  )}
                >
                  {schoolPeriod.is_active === true ?
                    t("custom_school_period_active") :
                    t("custom_school_period_inactive")}
                </Badge>
              </TableCell>

              {/* ACCIONES */}
              <TableCell className="text-center align-middle py-4">
                <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                  <CustomActionsMenuSchoolPeriod
                    schoolPeriod={schoolPeriod}
                    handleActivateClick={handleActivateClick}
                    handleDeactivateClick={handleDeactivateClick}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* ESTADO VACÍO */}
          {schoolPeriods.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-[300px] text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <CalendarRange className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {t("custom_desktop_table_school_period_not_found")}
                    </p>
                    <p className="text-sm">
                      {t("custom_desktop_table_school_period_setting_filters")}
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
};