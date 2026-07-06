import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';
import type { SurveyQuestion } from '../interfaces/all-questions.interface';
import type { QuestionFormValues } from '../schemas/question.schema';

interface CreateTicketParams {
    data: QuestionFormValues;
    idempotencyKey: string;
}

export const createQuestionAction = async (
    { data: payload, idempotencyKey }: CreateTicketParams
): Promise<SurveyQuestion> => {
    const { data } = await soporteTecnicoApi.post<SurveyQuestion>(
        '/survey/questions',
        payload,
        {
            headers: {
                'x-idempotency-key': idempotencyKey,
            },
        }
    );

    return data;
};