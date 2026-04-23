import { useTranslation } from "react-i18next";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { Navigate, useNavigate, useParams } from "react-router";
import { useSchoolPeriod } from "../hooks/useSchoolPeriod"; // Solo lee
import { useMutateSchoolPeriod } from "../hooks/useMutateSchoolPeriod"; // Solo escribe
import { toast } from "sonner";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { SchoolPeriodForm } from "../components/SchoolPeriodForm";
import type { SchoolPeriodFormValues } from "../schemas/create-school-period.schema";
import { getAxiosErrorMessage } from "../../lib/helpers/getAxiosErrorMessage";
import { useEffect } from "react";

export const EditSchoolPeriodPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { isLoading, isError, data: schoolPeriod } = useSchoolPeriod(id);
    const { mutateAsync, isPending } = useMutateSchoolPeriod();

    useEffect(() => {
        if (isError || (!isLoading && !schoolPeriod && id)) {
            toast.error('Error al obtener el Periodo Escolar', {
                description: 'El periodo no existe o hubo un error de conexión',
                duration: 5000,
                position: 'top-right',
            });
        }
    }, [isError, isLoading, schoolPeriod, id]);

    const handleSubmit = async (values: SchoolPeriodFormValues) => {
        await mutateAsync({ ...values, id }, {
            onSuccess: (responseData) => {
                toast.success(t('success_update_school_period_message'));
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

    if (!id || isError || (!isLoading && !schoolPeriod)) {
        return <Navigate to="/school-period" replace />;
    }

    if (isLoading) return <CustomFullScreenLoading />;

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            <CustomTitlePageWithBack
                backLink="/school-period"
                title={t('update_school_period_page_title')}
                description={t('update_school_period_page_description')}
            />
            <div className="space-y-6">
                <SchoolPeriodForm
                    schoolPeriod={schoolPeriod}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    titleButton={t('school_period_form_button_update')}
                />
            </div>
        </div>
    );
};