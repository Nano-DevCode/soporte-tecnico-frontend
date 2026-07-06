import { useTranslation } from 'react-i18next';
import { useSmartNavigation } from '@/components/hooks/useSmartNavigation';
import { useCreateQuestion } from '../hooks/useCreateQuestion';
import { sileo } from 'sileo';
import type { QuestionFormValues } from '../schemas/question.schema';
import { isAxiosError } from 'axios';
import { CustomFormPageLayout } from '@/components/custom/CustomFormPageLayout';
import { QuestionForm } from '../components/QuestionForm';
import { getAxiosErrorMessage } from '@/lib/helpers/getAxiosErrorMessage';
import { Card, CardHeader } from '@/components/ui/card';
import { CustomHeaderCard } from '@/components/custom/CustomHeaderCard';
import { Separator } from '@/components/ui/separator';
import { HelpCircle } from 'lucide-react';

export const CreateQuestionPage = () => {
	const { t } = useTranslation();
	const { navigateSmartBack } = useSmartNavigation('/survey/questions');

	const { mutateAsync, isPending, isSuccess } = useCreateQuestion();

	const handleSubmit = async (values: QuestionFormValues, idempotencyKey: string) => {
		try {
			await mutateAsync({ data: values, idempotencyKey });

			sileo.success({
				title: t('surveys.questions.create_page.success.title'),
				description: t('surveys.questions.create_page.success.message'),
				duration: 5000,
			});

			navigateSmartBack();

		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 409) {
				return;
			}
			console.error("Error en la mutación:", error);
			sileo.error({
				title: t('surveys.questions.create_page.error.title'),
				description: getAxiosErrorMessage(error as Error),
				duration: 7000,
			});
		}
	};

	const handleCancel = () => {
		navigateSmartBack();
	};

	return (
		<CustomFormPageLayout
			backLink={`/surveys/questions`}
			title={t('surveys.questions.create_page.title')}
			description={t('surveys.questions.create_page.description')}
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
					isPending={isPending || isSuccess}
					titleButton={t('common.buttons.create')}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
				/>
			</ Card>
		</CustomFormPageLayout>
	);
}
