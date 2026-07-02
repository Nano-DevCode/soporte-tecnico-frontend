import { CalendarRange, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { CustomActionsMenuSchoolPeriod } from "./CustomActionsMenuSchoolPeriod";
import type { SchoolPeriod } from "../interfaces/school-period.interface";
import { formatPeriodType } from "../utils/format-period-type";
import { toFormatLocalDateString } from "../../lib/helpers/to-format-local-date-string";

interface Props {
  schoolPeriods: SchoolPeriod[];
  handleActivateClick: (schoolPeriod: SchoolPeriod) => void;
  handleDeactivateClick: (schoolPeriod: SchoolPeriod) => void;
  handleCardClick: (id: string) => void;
}

export const CustomMobilCardScholPeriods = (
  { schoolPeriods, handleActivateClick, handleDeactivateClick, handleCardClick }: Props
) => {

  const { t, i18n } = useTranslation()

  return (
    <div className="md:hidden space-y-3">
      {schoolPeriods.map((schoolPeriod) => (
        <div
          key={schoolPeriod.id}
          className="relative flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        >

          <button
            type="button"
            className="absolute inset-0 w-full h-full rounded-xl z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleCardClick(schoolPeriod.id)}
            aria-label={`Ver detalles del periodo ${schoolPeriod.name}`}
          />

          <div className="min-w-0 flex-1 space-y-2">

            <p className="text-sm font-bold text-foreground leading-snug whitespace-normal wrap-break-word">
              {schoolPeriod.name}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Tag className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium text-foreground/80">
                {formatPeriodType(schoolPeriod.period_type, t)}
              </span>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="whitespace-normal break-all leading-relaxed">
                {toFormatLocalDateString(schoolPeriod.date_start, i18n.language)}
                -
                {toFormatLocalDateString(schoolPeriod.date_end, i18n.language)}
              </span>
            </div>

            <div className="pt-1">
              <Badge
                className={cn(
                  "font-semibold px-2.5 text-[10px] py-0.5 text-xs rounded-full shadow-sm",
                  schoolPeriod.is_active === true
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                )}
              >
                {schoolPeriod.is_active === true ?
                  t("custom_school_period_active") :
                  t("custom_school_period_inactive")}
              </Badge>
            </div>
          </div>

          <div className="shrink-0 relative z-20">
            <div onClick={(e) => e.stopPropagation()}>
              <CustomActionsMenuSchoolPeriod
                schoolPeriod={schoolPeriod}
                handleActivateClick={handleActivateClick}
                handleDeactivateClick={handleDeactivateClick}
              />
            </div>
          </div>
        </div>
      ))}

      {schoolPeriods.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <CalendarRange className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {t("custom_desktop_table_school_period_not_found")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {t('custom_desktop_table_school_period_setting_filters')}
          </p>
        </div>
      )}
    </div>
  )
}