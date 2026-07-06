import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';
import type { SurveyQuestion } from '../interfaces/all-questions.interface';

export const activateQuestionAction = async (id: string): Promise<SurveyQuestion> => {
    const { data } = await soporteTecnicoApi.patch<SurveyQuestion>(
        `/survey/questions/${id}/activate`
    );

    return data;
};

export const deactivateQuestionAction = async (id: string): Promise<SurveyQuestion> => {
    const { data } = await soporteTecnicoApi.patch<SurveyQuestion>(
        `/survey/questions/${id}/deactivate`
    );

    return data;
};