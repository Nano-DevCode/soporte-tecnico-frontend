import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BanIcon, CircleCheck, Loader2, PencilLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";
import { useActivateQuestion, useDeactivateQuestion } from "../hooks/useStatusQuestion";
import { sileo } from "sileo";
import { useNavigate } from "react-router";

interface QuestionActionsCellProps {
    question: SurveyQuestion;
}

export const QuestionActionsCell = ({ question }: QuestionActionsCellProps) => {
    const { t } = useTranslation();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate()

    const { mutate: activateQuestion, isPending: isActivating } = useActivateQuestion();
    const { mutate: deactivateQuestion, isPending: isDeactivating } = useDeactivateQuestion();

    const isBusy = isActivating || isDeactivating;
    const isActive = question.isActive;

    const handleConfirmStatusChange = useCallback(() => {
        const options = {
            onSuccess: () => {
                sileo.success({
                    description: isActive
                        ? t("surveys.questions.notifications.deactivated_success")
                        : t("surveys.questions.notifications.activated_success")
                });
                setIsConfirmOpen(false);
            },
            onError: (error: Error) => {
                console.error("Error al cambiar el estado de la pregunta:", error);
                sileo.error({ description: t("surveys.questions.notifications.status_error") });
            }
        };

        if (isActive) {
            deactivateQuestion(question.id, options);
        } else {
            activateQuestion(question.id, options);
        }
    }, [isActive, question.id, activateQuestion, deactivateQuestion, t]);

    return (
        <div className="flex flex-wrap gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
                size="sm"
                variant="secondary"
                disabled={isBusy}
                onClick={() => navigate(`/survey/questions/${question.id}/edit`)}
            >
                <PencilLineIcon className="w-4 h-4 mr-1.5" />
                {t("common.buttons.edit")}
            </Button>

            <Button
                size="sm"
                variant={isActive ? "destructive" : "default"}
                disabled={isBusy}
                onClick={() => setIsConfirmOpen(true)}
                className={`${!isActive ? "bg-green-700 text-white hover:bg-green-800 shadow-sm" : ""}`}
            >
                {isBusy ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : isActive ? (
                    <BanIcon className="w-4 h-4 mr-1.5" />
                ) : (
                    <CircleCheck className="w-4 h-4 mr-1.5" />
                )}
                {isActive
                    ? t("surveys.questions.actions.deactivate")
                    : t("surveys.questions.actions.activate")}
            </Button>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isActive
                                ? t("surveys.questions.dialogs.deactivate_title")
                                : t("surveys.questions.dialogs.activate_title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isActive
                                ? t("surveys.questions.dialogs.deactivate_desc", { question: question.questionText })
                                : t("surveys.questions.dialogs.activate_desc", { question: question.questionText })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBusy}>
                            {t("common.buttons.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isBusy}
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmStatusChange();
                            }}
                            className={isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-green-700 hover:bg-green-800 text-white"}
                        >
                            {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t("common.buttons.confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};