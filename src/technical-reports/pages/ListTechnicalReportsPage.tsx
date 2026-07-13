import { ClipboardList } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { CustomListTechnicalReports } from "../components/CustomListTechnicalReports";
export function ListTechnicalReportsPage() {

  const { t } = useTranslation();

  return (
    <>
      <CustomTitleCard icon={ClipboardList}
        title={t("technical_reports.list_page.title")}
        description={t("technical_reports.list_page.description")} />
      <div className="space-y-3 md:space-y-6">

        <CustomListTechnicalReports />
      </div >
    </>
  );
}