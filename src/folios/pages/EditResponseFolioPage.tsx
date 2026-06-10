import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useGetResponseFolio } from "../hooks/useGetResponseFolio";
import { useEditResponseFolio } from "../hooks/useEditResponseFolio";
import { useEffect } from "react";
import { sileo } from "sileo";
import type { ResponseFolioFormOutput } from "../schemas/UpdateResponsesFolio.schema";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsResponseFolio } from "../components/DetailsResponseFolio";
import { ResponseFolioForm } from "../components/forms/ResponseFolioForm";

export const EditResponseFolioPage = () => {
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/folios/responses');

    const { data: responseFolio, isLoading, isError } = useGetResponseFolio();
    const { mutate, isPending, isSuccess } = useEditResponseFolio();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !responseFolio) {
            sileo.error({
                title: t('folios.responses.not_found.title'),
                description: t('folios.responses.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, t, navigateFallback, responseFolio]);

    const handleSubmit = (values: ResponseFolioFormOutput) => {
        mutate({ editResponsePayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('folios.responses.edit_page.success.title'),
                    description: t('folios.responses.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack();
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('folios.responses.edit_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack();
    };

    if (isLoading || !responseFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.tickets.edit_my_department_page.title')}
                description={t('folios.tickets.edit_my_department_page.description')}
                backLink={"/folios/responses"}
            >
                <></>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.tickets.edit_my_department_page.title')}
            description={t('folios.tickets.edit_my_department_page.description')}
            backLink={"/folios/responses"}
        >
            <DetailsResponseFolio
                responseFolio={responseFolio}>

                <ResponseFolioForm
                    responseFolio={responseFolio}
                    isPending={isPending || isSuccess}
                    titleButton={t('common.buttons.save_changes')}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </DetailsResponseFolio>
        </CustomFormPageLayout>
    )
}
