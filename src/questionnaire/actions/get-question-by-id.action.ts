import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";

export const getQuestionByIdAction = async (id: string): Promise<SurveyQuestion> => {
    const { data } = await soporteTecnicoApi.get<SurveyQuestion>(
        `/survey/questions/${id}`
    );

    return data
};