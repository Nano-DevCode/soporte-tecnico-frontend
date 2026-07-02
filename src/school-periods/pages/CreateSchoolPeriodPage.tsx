import { useTranslation } from "react-i18next";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { SchoolPeriodForm } from "../components/SchoolPeriodForm";
import type { SchoolPeriodFormOutput } from "../schemas/create-school-period.schema";
import { useMutateSchoolPeriod } from "../hooks/useMutateSchoolPeriod";
import { getAxiosErrorMessage } from "../../lib/helpers/getAxiosErrorMessage";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { sileo } from "sileo";

export const CreateSchoolPeriodPage = () => {
    const { t } = useTranslation();
    const { mutateAsync, isPending } = useMutateSchoolPeriod();
    const { navigateSmartBack } = useSmartNavigation('/school_period');

    const handleSubmit = async (values: SchoolPeriodFormOutput) => {
        await mutateAsync({ schoolPeriodLike: values, periodId: 'new' }, {
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
        navigateSmartBack(`/school_period`);
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
                    onCancel={handleCancel}
                    titleButton={t('school_period_form_button_create')}
                />
            </div>
        </div>
    );
};