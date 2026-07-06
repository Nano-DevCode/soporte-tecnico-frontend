import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createQuestionFormSchema = (t: TFunction) => {
    const QuestionTypeEnum = z.enum(['RATING', 'TEXT'], {
        error: (issue) => {
            if (issue.input === undefined) {
                return t('surveys.questions.form.validation.type_required');
            }
            return t('surveys.questions.form.validation.type_invalid');
        },
    });

    return z.object({
        questionText: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? t('surveys.questions.form.validation.text_required')
                        : t('surveys.questions.form.validation.text_string'),
            })
            .trim()
            .min(5, {
                error: t('surveys.questions.form.validation.text_min', { min: 5 }),
            })
            .max(150, {
                error: t('surveys.questions.form.validation.text_max', { max: 150 }),
            }),

        type: QuestionTypeEnum
    });
};

export const updateQuestionFormSchema = (t: TFunction) => {
    return createQuestionFormSchema(t).partial();
};

export type QuestionFormValues = z.infer<ReturnType<typeof createQuestionFormSchema>>;
export type UpdateQuestionFormValues = z.infer<ReturnType<typeof updateQuestionFormSchema>>;