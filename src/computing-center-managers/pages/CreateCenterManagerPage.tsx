import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateCenterManager } from "../hooks/useCreateCenterManager";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { sileo } from "sileo";
import { CenterManagerForm } from "../components/CenterManagerForm";
import type { CenterManagerFormValues } from "../schemas/create-center-manager.schema";


export const CreateCenterManagerPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate, isPending } = useCreateCenterManager();

    const handleSubmit = (values: CenterManagerFormValues) => {
        mutate(values, {
            onSuccess: (data) => {
                sileo.success({
                    title: t('center_managers.create_page.success.title'),
                    description: t('center_managers.create_page.success.message'),
                    duration: 5000,
                });
                navigate(`/center-managers/${data.id}`, { replace: true });
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('center_managers.create_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate('/center-managers');
    };

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink="/center-managers"
                title={t('center_managers.create_page.title')}
                description={t('center_managers.create_page.description')}
            />
            <CenterManagerForm
                isPending={isPending}
                titleButton={t('common.buttons.create')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
