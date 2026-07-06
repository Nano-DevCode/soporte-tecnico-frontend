import { useEffect, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";
import { Textarea } from "@/components/ui/textarea";
import { createSurveySchema, type SubmitSurveyPayload, type SurveyFormInput, type SurveyFormOutput } from "@/tickets/schemas/createSurveySchema";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type SurveyAnswers = Record<string, string>;

interface SatisfactionSurveyProps {
    questions: SurveyQuestion[],
    onSubmit: (payload: SubmitSurveyPayload) => void;
    onValidationChange?: (isValid: boolean) => void;
}

// const QUESTIONS: Question[] = [
//   { id: "q1", text: "¿Cómo calificarías tu experiencia general con nuestro sistema?" },
//   { id: "q2", text: "¿Qué tan fácil fue encontrar lo que buscabas hoy?" },
//   { id: "q3", text: "¿Cómo evalúas la velocidad y rendimiento de la plataforma?" },
//   { id: "q4", text: "¿Qué tan intuitivo te resulta el diseño visual?" },
//   { id: "q5", text: "¿Qué tan probable es que nos recomiendes a un colega?" },
// ];

const LEVELS = [
    { value: "1", label: "Pésimo", emoji: "😡", colorClass: "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900" },
    { value: "2", label: "Malo", emoji: "😕", colorClass: "text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900" },
    { value: "3", label: "Regular", emoji: "😐", colorClass: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900" },
    { value: "4", label: "Bueno", emoji: "🙂", colorClass: "text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-950/20 dark:border-lime-900" },
    { value: "5", label: "Excelente", emoji: "🤩", colorClass: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900" },
];

export function SatisfactionSurvey({ questions, onSubmit, onValidationChange }: SatisfactionSurveyProps) {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const schema = useMemo(() => createSurveySchema(questions), [questions]);

    const form = useForm<SurveyFormOutput, unknown, SurveyFormInput>({
        resolver: zodResolver(schema),
        defaultValues: {
            rawAnswers: {},
        },
        mode: "onChange",
    });

    const rawAnswers = useWatch({
        control: form.control,
        name: "rawAnswers",
        defaultValue: {},
    });

    const answeredCount = Object.values(rawAnswers || {}).filter((v) => v !== undefined && v !== "").length;
    const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;
    // const isFormComplete = answeredCount === questions.length;

    const isValid = form.formState.isValid;

    useEffect(() => {
        if (onValidationChange && isValid !== undefined) {
            onValidationChange(isValid);
        }
    }, [isValid, onValidationChange]);

    const handleFormSubmit = (data: SurveyFormInput): void => {
        const formattedAnswers: SubmitSurveyPayload["answers"] = questions.map((q) => {
            const rawValue = data.rawAnswers[q.id];

            if (q.type === "RATING") {
                return {
                    questionId: q.id,
                    ratingValue: Number(rawValue),
                };
            }

            return {
                questionId: q.id,
                textValue: String(rawValue).trim(),
            };
        });

        onSubmit({ answers: formattedAnswers });
        setIsSubmitted(true);
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    //   e.preventDefault();
    //   onSubmit(answers);
    //   setIsSubmitted(true);

    //   // if (onComplete) {
    //   //   setTimeout(() => {
    //   //     onComplete();
    //   //     setTimeout(handleReset, 300);
    //   //   }, 2500);
    //   // }
    // };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-6 animate-in fade-in zoom-in duration-500 min-h-100">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full" />
                    <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10 animate-bounce" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                        ¡Gracias por tu feedback!
                    </h3>
                    <p className="text-muted-foreground font-medium">
                        Tus respuestas nos ayudan a crear una mejor experiencia.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full space-y-1.5">
            <h2 className="text-lg leading-none font-semibold">
                Ayúdanos a mejorar
            </h2>
            <p className="text-sm text-muted-foreground">
                Te tomará menos de un minuto. Queremos escucharte.
            </p>

            <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col flex-1" id="close-ticket-survey-form">
                <ScrollArea className="max-h-[50vh]">
                    {questions.map((question, index) => (
                        <div key={question.id} className="space-y-3 px-2 sm:pr-5 py-2 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            <p className="font-semibold text-foreground/90 text-sm leading-tight">
                                <span className="text-primary mr-2">{index + 1}.</span>
                                {question.questionText}
                            </p>

                            <Controller
                                control={form.control}
                                name={`rawAnswers.${question.id}`}
                                render={({ field }) =>
                                    question.type === "RATING" ? (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={String(field.value || "")}
                                            className="grid grid-cols-5 gap-2 sm:gap-4"
                                        >
                                            {LEVELS.map((level) => {
                                                const uniqueId = `${question.id}-${level.value}`;
                                                const isSelected = String(field.value) === level.value;

                                                return (
                                                    <div key={uniqueId} className="relative group">
                                                        <RadioGroupItem value={level.value} id={uniqueId} className="peer sr-only" />
                                                        <Label
                                                            htmlFor={uniqueId}
                                                            className={`
                                                                flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl gap-4 border-2 cursor-pointer 
                                                                transition-all duration-300 ease-out transform
                                                                hover:scale-105 hover:shadow-md
                                                                ${isSelected
                                                                    ? `${level.colorClass} shadow-sm scale-105 ring-2 ring-primary/20 ring-offset-2`
                                                                    : "border-muted bg-card text-muted-foreground hover:border-primary/50 grayscale hover:grayscale-0"
                                                                }
                                                            `}
                                                        >
                                                            <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110">
                                                                {level.emoji}
                                                            </span>
                                                            <span className={`text-[10px] sm:text-xs text-center font-bold leading-tight transition-colors ${isSelected ? "opacity-100" : "opacity-70"}`}>
                                                                {level.label}
                                                            </span>
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    ) : (
                                        <Textarea
                                            placeholder="Escribe tus comentarios aquí..."
                                            value={String(field.value || "")}
                                            onChange={field.onChange}
                                            className="resize-none min-h-20"
                                        />

                                    )
                                }
                            />

                        </div>
                    ))}
                </ScrollArea>
            </form >
        </div >
    );
}