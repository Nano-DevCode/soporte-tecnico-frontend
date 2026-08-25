import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useGetOTFolio } from "../hooks/useGetOTFolio";
import { useEditOTFolio } from "../hooks/useEditOTFolio";
import { useEffect } from "react";
import { sileo } from "sileo";
import type { OTFolioFormOutput } from "../schemas/UpdateOTFolio.schema";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsOTFolio } from "../components/DetailsOTFolio";
import { OTFolioForm } from "../components/forms/OTFolioForm";

export const EditOTFolioPage = () => {
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/folios/ot');

    const { data: otFolio, isLoading, isError } = useGetOTFolio();
    const { mutate, isPending, isSuccess } = useEditOTFolio();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !otFolio) {
            sileo.error({
                title: t('folios.ot.not_found.title'),
                description: t('folios.ot.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, t, navigateFallback, otFolio]);

    const handleSubmit = (values: OTFolioFormOutput) => {
        mutate({ editOTPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('folios.ot.edit_page.success.title'),
                    description: t('folios.ot.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack();
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('folios.ot.edit_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack();
    };

    if (isLoading || !otFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.ot.edit_page.title')}
                description={t('folios.ot.edit_page.description')}
                backLink={"/folios/ot"}
            >
                <></>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.ot.edit_page.title')}
            description={t('folios.ot.edit_page.description')}
            backLink={"/folios/ot"}
        >
            <DetailsOTFolio
                otFolio={otFolio}>

                <OTFolioForm
                    otFolio={otFolio}
                    isPending={isPending || isSuccess}
                    titleButton={t('common.buttons.save_changes')}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </DetailsOTFolio>
        </CustomFormPageLayout>
    )
}
