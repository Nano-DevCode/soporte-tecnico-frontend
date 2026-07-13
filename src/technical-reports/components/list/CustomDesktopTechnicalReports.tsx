import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { CustomTechnicalReportElement } from "./CustomTechnicalReportElement";
import type { SimpleTicket } from "@/technical-reports/interfaces/list-technical-reports.interface";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
interface Props {
    data: SimpleTicket[];
    searchTerm?: string;

}
export const CustomDesktopTechnicalReports = ({ data, searchTerm }: Props) => {
    const { t } = useTranslation();

    return (
        < div className="space-y-4" >
            {
                data.map((article) => (
                    <CustomTechnicalReportElement key={article.id} ticket={article} searchTerm={searchTerm} />
                ))
            }

            {
                data.length === 0 && (
                    <CustomEmptyListState
                        icon={BookOpen}
                        title={t("technical_reports.empty.title")}
                        description={t("technical_reports.empty.description")}
                    />
                )
            }
        </div >
    );
};