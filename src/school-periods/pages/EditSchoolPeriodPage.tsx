import { useTranslation } from "react-i18next";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useParams } from "react-router";
import { useSchoolPeriod } from "../hooks/useSchoolPeriod"; // Solo lee
import { useMutateSchoolPeriod } from "../hooks/useMutateSchoolPeriod"; // Solo escribe
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { SchoolPeriodForm } from "../components/SchoolPeriodForm";
import type { SchoolPeriodFormOutput } from "../schemas/create-school-period.schema";
import { getAxiosErrorMessage } from "../../lib/helpers/getAxiosErrorMessage";
import { useEffect } from "react";
import { sileo } from "sileo";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

export const EditSchoolPeriodPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateSmartBack, navigateFallback } = useSmartNavigation('/school_period');

    const { isLoading, isError, data: schoolPeriod } = useSchoolPeriod(id);
    const { mutateAsync, isPending } = useMutateSchoolPeriod();

    useEffect(() => {
        if (isError || (!isLoading && !schoolPeriod && id)) {
            sileo.error({
                title: t('school_periods.not_found.title'),
                description: t('school_periods.not_found.message'),
                duration: 6000,
            });
            navigateFallback('/');
            return;
        }
    }, [isError, isLoading, schoolPeriod, id, t, navigateFallback]);

    const handleSubmit = async (values: SchoolPeriodFormOutput) => {
        await mutateAsync({ schoolPeriodLike: values, periodId: id }, {
            onSuccess: () => {
                sileo.success({
                    title: t('school_periods.edit_page.success.title'),
                    description: t('school_periods.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack();
            },
            onError: (error) => {
                sileo.error({
                    title: t('school_periods.edit_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/school_period/${id}`);
    };

    if (!id || isError || (!isLoading && !schoolPeriod)) {
        navigateFallback('/');
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
                    onCancel={handleCancel}
                    titleButton={t('school_period_form_button_update')}
                />
            </div>
        </div>
    );
};