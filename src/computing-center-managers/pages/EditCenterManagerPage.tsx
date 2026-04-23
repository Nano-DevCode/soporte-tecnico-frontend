import { useTranslation } from "react-i18next";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useNavigate, useParams } from "react-router";
import { getAxiosErrorMessage } from "../../lib/helpers/getAxiosErrorMessage";
import { useUpdateCenterManager } from "../hooks/useUpdateCenterManager";
import { sileo } from "sileo";
import { useCenterManager } from "../hooks/useCenterManager";
import type { CenterManagerFormValues } from "../schemas/create-center-manager.schema";
import { CenterManagerForm } from "../components/CenterManagerForm";
import { useEffect } from "react";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";

export const EditCenterManagerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: manager, isLoading, isError } = useCenterManager(id);
    const { mutate, isPending } = useUpdateCenterManager();

    useEffect(() => {
        if (isError || (!isLoading && !manager && id)) {
            sileo.error({
                title: t('center_managers.update_page.not_found.title'),
                description: t('center_managers.update_page.not_found.message'),
                duration: 6000,
            });

            navigate('/center-managers', { replace: true });
        }
    }, [isError, isLoading, manager, id, navigate, t]);


    const handleSubmit = (values: CenterManagerFormValues) => {
        mutate({ id: id!, payload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('center_managers.update_page.success.title'),
                    description: t('center_managers.update_page.success.message'),
                    duration: 4000,
                });
                navigate(`/center-managers`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('center_managers.update_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate('/center-managers');
    };

    if (isLoading) {
        return <CustomFullScreenLoading />
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink="/center-managers"
                title={t('center_managers.update_page.title')}
                description={t('center_managers.update_page.description')}
            />

            <CenterManagerForm
                centerManager={manager}
                isPending={isPending}
                titleButton={t('common.buttons.save_changes')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
};