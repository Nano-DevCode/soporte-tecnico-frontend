import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useSmartNavigation } from '@/components/hooks/useSmartNavigation';
import { useUpdateQuestion } from '../hooks/useUpdateQuestion';
import { sileo } from 'sileo';
import type { UpdateQuestionFormValues } from '../schemas/question.schema';
import { isAxiosError } from 'axios';
import { CustomFormPageLayout } from '@/components/custom/CustomFormPageLayout';
import { QuestionForm } from '../components/QuestionForm';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CustomHeaderCard } from '@/components/custom/CustomHeaderCard';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useGetQuestionById } from '../hooks/getQuestionById';

export const EditQuestionPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { navigateSmartBack, navigateFallback } = useSmartNavigation('/surveys/questions');

    const { data: question, isLoading: isLoadingQuestion, isError: isErrorQuestion } = useGetQuestionById(id || '');

    const { mutateAsync: updateQuestion, isPending: isUpdating, isSuccess } = useUpdateQuestion();

    useEffect(() => {
        if (isLoadingQuestion) return;

        if (isErrorQuestion || !question) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('surveys.questions.edit_page.error.not_found'),
                duration: 5000,
            });
            navigateFallback();
        }
    }, [isErrorQuestion, isLoadingQuestion, question, t, navigateFallback]);

    const handleSubmit = async (values: UpdateQuestionFormValues) => {
        if (!id) return;

        try {
            await updateQuestion({ id, payload: values });

            sileo.success({
                title: t('surveys.questions.edit_page.success.title'),
                description: t('surveys.questions.edit_page.success.message'),
                duration: 5000,
            });

            navigateSmartBack();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                return;
            }
            console.error("Error al actualizar la pregunta:", error);
            sileo.error({
                title: t('surveys.questions.edit_page.error.title'),
                description: getAxiosErrorMessage(error as Error),
                duration: 7000,
            });
        }
    };

    const handleCancel = () => {
        navigateSmartBack();
    };

    if (isLoadingQuestion || !question) {
        return (
            <CustomFormPageLayout
                backLink={`/surveys/questions`}
                title={t('surveys.questions.edit_page.title')}
                description={t('surveys.questions.edit_page.description')}
            >
                <Card>
                    <CardContent className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            backLink={`/surveys/questions`}
            title={t('surveys.questions.edit_page.title')}
            description={t('surveys.questions.edit_page.description')}
        >
            <Card>
                <CardHeader className="gap-0">
                    <CustomHeaderCard
                        title={t('surveys.questions.form.header.title')}
                        description={t('surveys.questions.form.header.description')}
                        icon={HelpCircle}
                    />
                </CardHeader>
                <Separator />

                <QuestionForm
                    question={question}
                    isPending={isUpdating || isSuccess}
                    titleButton={t('common.buttons.update')}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </Card>
        </CustomFormPageLayout>
    );
};