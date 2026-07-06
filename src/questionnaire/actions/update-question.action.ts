import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";
import type { UpdateQuestionFormValues } from "../schemas/question.schema";

export interface UpdateQuestionProps {
    id: string;
    payload: UpdateQuestionFormValues
}

export const updateQuestionAction = async ({
    id,
    payload
}: UpdateQuestionProps): Promise<SurveyQuestion> => {
    const { data } = await soporteTecnicoApi.patch<SurveyQuestion>(
        `/survey/questions/${id}`,
        payload
    );
    return data
};