import type { SurveyQuestion } from '../interfaces/all-questions.interface';
import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';

export const getActiveQuestions = async (): Promise<SurveyQuestion[]> => {

    const { data } = await soporteTecnicoApi.get<SurveyQuestion[]>(`/survey/questions`, {
    });

    return data;
};