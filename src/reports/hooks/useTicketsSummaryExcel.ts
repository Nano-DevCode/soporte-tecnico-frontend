import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useState } from "react";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";
import { getTicketsSummaryExcelAction } from "../actions/get-reports-tickets.action";

export const useGetTicketsSummaryExcel = () => {
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);

    const mutate = async (...args: Parameters<typeof getTicketsSummaryExcelAction>) => {
        setIsPending(true);
        try {
            const blob = await getTicketsSummaryExcelAction(...args);

            const fileUrl = window.URL.createObjectURL(
                new Blob([blob], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
            );

            const link = document.createElement('a');
            link.href = fileUrl;

            const fileName = `Estadisticas_Centro_Computo_${new Date().getTime()}.xlsx`;
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
        } catch (error) {
            sileo.error({
                title: t('tickets.documents.errors.title'),
                description: getAxiosErrorMessage(error as Error) || 'Error al descargar el reporte en Excel.',
            });
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, mutateAsync: mutate, isPending };
};