import { useTranslation } from "react-i18next";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SchoolPeriodForm } from "../components/SchoolPeriodForm";
import type { SchoolPeriodFormValues } from "../schemas/create-school-period.schema";
import { useMutateSchoolPeriod } from "../hooks/useMutateSchoolPeriod";
import { getAxiosErrorMessage } from "../../lib/helpers/getAxiosErrorMessage";
// IMPORTANTE: Aquí usas el hook que separamos exclusivamente para mutaciones

export const CreateSchoolPeriodPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutateAsync, isPending } = useMutateSchoolPeriod();

    const handleSubmit = async (values: SchoolPeriodFormValues) => {
        await mutateAsync(values, {
            onSuccess: (responseData) => {
                toast.success(t('success_create_school_period_message'), {
                    duration: 15000,
                    closeButton: true,
                    position: 'top-right',
                });
                navigate(`/school-period/${responseData.id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                toast.error('Error al guardar el Periodo Escolar', {
                    description: errorMessage,
                    duration: 10000,
                    closeButton: true,
                    position: 'top-right',
                });
            },
        });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            <CustomTitlePageWithBack
                backLink="/school-period"
                title={t('create_school_period_page_title')}
                description={t('create_school_period_page_description')}
            />
            <div className="space-y-6">
                <SchoolPeriodForm
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    titleButton={t('school_period_form_button_create')}
                />
            </div>
        </div>
    );
};