import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { BrushCleaning, Loader2, Save, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuestionFormSchema, type QuestionFormValues } from "../schemas/question.schema";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";
import { v4 as uuidv4 } from 'uuid';


interface Props {
    question?: SurveyQuestion;
    isPending: boolean;
    titleButton: string;
    onSubmit: (data: QuestionFormValues, idempotencyKey: string) => void;
    onCancel: () => void;
}

export const QuestionForm = ({ question, onSubmit, isPending, titleButton, onCancel }: Props) => {
    const { t } = useTranslation();

    const [idempotencyKey] = useState(() => uuidv4());

    const schema = useMemo(() => createQuestionFormSchema(t), [t]);

    const defaultFormValues: QuestionFormValues = {
        questionText: question?.questionText ?? "",
        type: question?.type ?? "RATING"
    };

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultFormValues,
        values: defaultFormValues,
    });

    const isBusy = isPending || form.formState.isSubmitting;

    const handleSafeSubmit = (data: QuestionFormValues) => {
        onSubmit(data, idempotencyKey);
    };

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    return (
        <>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSafeSubmit)} noValidate id="form-question">
                        <div className="grid grid-cols-1 gap-6 items-start">

                            <FormField
                                control={form.control}
                                name="questionText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('surveys.questions.form.fields.text.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                placeholder={t('surveys.questions.form.fields.text.placeholder')}
                                                disabled={isBusy}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('surveys.questions.form.fields.type.label')}</FormLabel>
                                        <Select
                                            name={field.name}
                                            disabled={isBusy}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('surveys.questions.form.fields.type.placeholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position="popper">
                                                <SelectItem value="RATING">
                                                    {t('surveys.questions.types.rating')}
                                                </SelectItem>
                                                <SelectItem value="TEXT">
                                                    {t('surveys.questions.types.text')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isBusy || !form.formState.isDirty}
                    onClick={() => form.reset()}
                    className="w-full sm:w-auto"
                >
                    <BrushCleaning className="mr-2 h-4 w-4" />
                    {t('common.buttons.clean')}
                </Button>

                <Button
                    variant="outline"
                    type="button"
                    disabled={isBusy}
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-1.5 w-4 h-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-question"
                    disabled={isBusy || (!form.formState.isDirty && !!question)}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {titleButton}
                </Button>
            </CardFooter>
        </>
    );
};