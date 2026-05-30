// import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { CustomTechnicalReportElement } from "./CustomTechnicalReportElement";
import type { SimpleTicket } from "@/technical-reports/interfaces/list-technical-reports.interface";
interface Props {
    data: SimpleTicket[];
    searchTerm?: string;

}
export const CustomDesktopTechnicalReports = ({ data, searchTerm }: Props) => {
    // const { t } = useTranslation();

    return (
        < div className="space-y-4" >
            {
                data.map((article) => (
                    <CustomTechnicalReportElement key={article.id} ticket={article} searchTerm={searchTerm} />
                ))
            }

            {
                data.length === 0 && (
                    <div className="text-center py-12 px-4 border rounded-xl border-dashed bg-muted/10">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-medium text-foreground">No se encontraron soluciones</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Intenta buscar con otras palabras clave o describe el síntoma de otra forma.
                        </p>
                    </div>
                )
            }
        </div >
    );
};