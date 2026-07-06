import type { SurveyQuestion } from "@/questionnaire/interfaces/all-questions.interface";
import { z } from "zod";

export const createSurveySchema = (questions: SurveyQuestion[]) => {
    return z
        .object({
            rawAnswers: z.record(z.string(), z.union([z.string(), z.number()])),
        })
        .superRefine((data, ctx) => {
            questions.forEach((q) => {
                const val = data.rawAnswers[q.id];
                if (val === undefined || val === "" || val === null) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Por favor responde esta pregunta.",
                        path: ["rawAnswers", q.id],
                    });
                }
            });
        });
};

export type SurveySchemaType = ReturnType<typeof createSurveySchema>;
export type SurveyFormInput = z.input<SurveySchemaType>;
export type SurveyFormOutput = z.output<SurveySchemaType>;

export type SubmitSurveyPayload = {
    answers: Array<{
        questionId: string;
        ratingValue?: number;
        textValue?: string;
    }>;
};