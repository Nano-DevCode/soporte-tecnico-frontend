import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { useGetFaultValidities } from "@/common/fault-validities/hooks/useGetFaultValidities";
import { useEffect } from "react";
import { useGetTechnicalReportById } from "../hooks/useGetTechnicalReportById";
import type { EditTechnicalReportFormOutput } from "../schemas/edit-technical-report.schema";
import { EditTechnicalReportForm } from "../components/form/EditTechnicalReportForm";
import { InterveneTicketFormSkeleton } from "@/tickets/components/Skeletons/InterveneTicketFormSkeleton";
import { useUpdateTechnicalReport } from "../hooks/useUpdateTechnicalReport";

export const EditTechnicalReportPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateSmartBack, navigateFallback } = useSmartNavigation('/technical-reports');

    const { data: faultValidities, isLoading: isLoadingFault, isError: isFaultError } = useGetFaultValidities()
    const { data: technicalReport, isLoading: isLoadingReport, isError: isReportError } = useGetTechnicalReportById(id);
    const { mutate, isPending, isSuccess } = useUpdateTechnicalReport();

    const isLoading = isLoadingFault || isLoadingReport;
    const isError = isFaultError || isReportError;


    useEffect(() => {
        if (isLoading) return;

        if (isReportError || !technicalReport) {
            sileo.error({
                title: t('technical_reports.not_found.title'),
                description: t('technical_reports.not_found.description'),
                duration: 6000,
            });
            navigateFallback();
            return;
        }

        if (isError || !faultValidities) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [faultValidities, isError, isLoading, isReportError, navigateFallback, t, technicalReport]);

    const handleSubmit = (values: EditTechnicalReportFormOutput) => {
        if (!id) return

        mutate({
            reportId: id, updateTechnicalReportPayload: {
                ...values,
                equipment_ids: values.equipment_ids.map(eq => String(eq.id)),
                materials_used: values.materials_used || undefined
            }
        }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.intervene_page.success.title'),
                    description: t('tickets.intervene_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/technical-reports/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.intervene_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/technical-reports/${id}`);
    };

    if (isLoading || !faultValidities || !technicalReport || !id) {
        return (
            <CustomFormPageLayout
                backLink={`/technical-reports/${id}`}
                title={t('technical_reports.edit_page.title')}
                description={t('technical_reports.edit_page.description')}
            >
                <InterveneTicketFormSkeleton />
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/technical-reports/${id}`}
            title={t('technical_reports.edit_page.title')}
            description={t('technical_reports.edit_page.description')}
        >
            <EditTechnicalReportForm
                isPending={isPending || isSuccess}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                faultValidities={faultValidities}
                technicalReport={technicalReport} />
        </CustomFormPageLayout>
    )
}
