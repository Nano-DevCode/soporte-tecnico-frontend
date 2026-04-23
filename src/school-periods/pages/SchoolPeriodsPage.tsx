import { CalendarRange } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomFilterSchoolPeriods } from "../components/CustomFiltersSchoolPeriod";
import { SchoolPeriodActionDialog } from "../components/SchoolPeriodActionDialog";
import { CustomCreateButtonElement } from "@/components/custom/CustomCreateButtonElement";
import { CustomListSchoolPeriods } from "../components/CustomListSchoolPeriods";

export function SchoolPeriodsPage() {

  const { t } = useTranslation();


  return (
    <div className="space-y-6">
      <SchoolPeriodActionDialog />

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Lado izquierdo */}
        <CustomTitleCard icon={CalendarRange}
          title={t("custom_title_card_school_period_page_title")}
          description={t("custom_title_card_school_period_page_description")} />

        {/* Botón */}
        <CustomCreateButtonElement
          label={t("school_period_page_new")}
          to="/school-period/new"
        />
      </div>

      {/* Filtros */}
      <CustomFilterSchoolPeriods />

      {/* Lista de periodos escolares */}
      <CustomListSchoolPeriods />
    </div>
  );
}