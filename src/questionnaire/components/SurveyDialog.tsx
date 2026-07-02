import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

// --- TIPADO ESTRICTO ---
interface Question {
  id: string;
  text: string;
}

interface Level {
  value: string;
  label: string;
  emoji: string;
  colorClass: string; // Para darle un toque de color único a cada nivel al seleccionarlo
}

export type SurveyAnswers = Record<string, string>;

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answers: SurveyAnswers) => void;
}

// --- DATOS ---
const QUESTIONS: Question[] = [
  { id: "q1", text: "¿Cómo calificarías tu experiencia general con nuestro sistema?" },
  { id: "q2", text: "¿Qué tan fácil fue encontrar lo que buscabas hoy?" },
  { id: "q3", text: "¿Cómo evalúas la velocidad y rendimiento de la plataforma?" },
  { id: "q4", text: "¿Qué tan intuitivo te resulta el diseño visual?" },
  { id: "q5", text: "¿Qué tan probable es que nos recomiendes a un colega?" },
];

const LEVELS: Level[] = [
  { value: "1", label: "Pésimo", emoji: "😡", colorClass: "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900" },
  { value: "2", label: "Malo", emoji: "😕", colorClass: "text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900" },
  { value: "3", label: "Regular", emoji: "😐", colorClass: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900" },
  { value: "4", label: "Bueno", emoji: "🙂", colorClass: "text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-950/20 dark:border-lime-900" },
  { value: "5", label: "Excelente", emoji: "🤩", colorClass: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900" },
];

export function SurveyDialog({ open, onOpenChange, onSubmit }: SurveyDialogProps) {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;
  const isFormComplete = answeredCount === QUESTIONS.length;

  const handleOptionChange = (questionId: string, value: string): void => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleReset = (): void => {
    setAnswers({});
    setIsSubmitted(false);
    // Ya no necesitamos setProgress(0) aquí
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(answers);
    setIsSubmitted(true);
    
    // Animación de cierre tras enviar
    setTimeout(() => {
      onOpenChange(false);
      setTimeout(handleReset, 300); // Limpiar después de que termine la animación
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) setTimeout(handleReset, 300);
    }}>
      <DialogContent className="sm:max-w-162.5 p-0 overflow-hidden border-0 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-6 animate-in fade-in zoom-in duration-500">
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
        ) : (
          <>
            <div className="px-6 pt-6 pb-4 bg-muted/30">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Ayúdanos a mejorar
                </DialogTitle>
                <DialogDescription className="text-base">
                  Te tomará menos de un minuto. Queremos escucharte.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[60vh] overflow-y-auto space-y-10 custom-scrollbar">
              {QUESTIONS.map((question, index) => (
                <div key={question.id} className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <p className="font-semibold text-foreground/90 text-lg leading-tight">
                    <span className="text-primary mr-2">{index + 1}.</span>
                    {question.text}
                  </p>
                  
                  <RadioGroup
                    onValueChange={(value) => handleOptionChange(question.id, value)}
                    value={answers[question.id]}
                    className="grid grid-cols-5 gap-2 sm:gap-4"
                  >
                    {LEVELS.map((level) => {
                      const uniqueId = `${question.id}-${level.value}`;
                      const isSelected = answers[question.id] === level.value;
                      
                      return (
                        <div key={uniqueId} className="relative group">
                          <RadioGroupItem value={level.value} id={uniqueId} className="peer sr-only" />
                          <Label
                            htmlFor={uniqueId}
                            className={`
                              flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer 
                              transition-all duration-300 ease-out transform
                              hover:scale-105 hover:shadow-md
                              ${isSelected 
                                ? `${level.colorClass} shadow-sm scale-105 ring-2 ring-primary/20 ring-offset-2` 
                                : "border-muted bg-card text-muted-foreground hover:border-primary/50 grayscale hover:grayscale-0"
                              }
                            `}
                          >
                            <span className="text-3xl sm:text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">
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
                </div>
              ))}
            </form>

            <DialogFooter className="px-6 py-4 bg-muted/30 border-t flex-row justify-end gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormComplete}
                className="min-w-37.5 shadow-lg shadow-primary/25 transition-all active:scale-95"
              >
                {isFormComplete ? "Enviar Respuestas" : "Completa la encuesta"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}