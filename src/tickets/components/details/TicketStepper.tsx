import {
    Check,
    XCircle,
    AlertCircle,
    Archive,
    ClipboardList,
    Send,
    UserPlus,
    Wrench,
    CheckCircle2,
    Flag,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { TicketStatusCode } from '../../interfaces/ticket-status-code.interface';
import { useTranslation } from 'react-i18next';


const LINEAR_STEPS: TicketStatusCode[] = [
    'RECIBIDA',
    'CANALIZADA',
    'ASIGNADA',
    'ATENDIENDO',
    'SOLUCIONADA',
    'FINALIZADA',
    'CERRADA',
    'ARCHIVADA'
];

type StatusNameTranslationKey = `tickets.status.${TicketStatusCode}.name`;
type StatusDescTranslationKey = `tickets.status.${TicketStatusCode}.description`;

interface StateConfig {
    icon: React.ElementType;
    isException?: boolean;
    alertVariant?: 'default' | 'destructive' | 'warning';
    fallbackIndex?: number;
}
const STATE_DICTIONARY: Record<TicketStatusCode, StateConfig> = {
    RECIBIDA: { icon: ClipboardList },
    CANALIZADA: { icon: Send },
    ASIGNADA: { icon: UserPlus },
    ATENDIENDO: { icon: Wrench },
    SOLUCIONADA: { icon: CheckCircle2 },
    FINALIZADA: { icon: Flag },
    CERRADA: { icon: Lock },

    RECHAZADA: {
        icon: XCircle,
        isException: true,
        alertVariant: 'destructive',
        fallbackIndex: 0
    },
    NO_SOLUCIONADA: {
        icon: AlertCircle,
        isException: true,
        alertVariant: 'destructive',
        fallbackIndex: 3
    },
    ARCHIVADA: {
        icon: Archive,
        isException: false,
        alertVariant: 'default',
        fallbackIndex: 6
    },
};

interface TicketStepperProps {
    currentState: TicketStatusCode;
    className?: string;
}

export function TicketStepper({ currentState, className }: TicketStepperProps) {
    const { t } = useTranslation();
    const config = STATE_DICTIONARY[currentState] || STATE_DICTIONARY['RECIBIDA'];
    const isExceptional = config.isException;

    const activeIndex = isExceptional
        ? (config.fallbackIndex ?? 0)
        : LINEAR_STEPS.indexOf(currentState);

    const progressPercentage = activeIndex === 0
        ? 0
        : ((activeIndex * 100) + 50) / LINEAR_STEPS.length;

    return (
        <Card className={cn('w-full', className)}>
            <CardContent>
                {isExceptional && (
                    <Alert
                        variant={config.alertVariant === 'destructive' ? 'destructive' : 'default'}
                        className={cn("mb-8", config.alertVariant === 'default' && "bg-muted")}
                    >
                        <config.icon className="h-4 w-4" />
                        <AlertTitle>
                            {t(`tickets.status.${currentState}.name` as StatusNameTranslationKey)}
                        </AlertTitle>
                        <AlertDescription>
                            {t(`tickets.status.${currentState}.description` as StatusDescTranslationKey)}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-secondary rounded-full" />

                    <div
                        className={cn(
                            "absolute top-5 left-0 h-1 rounded-full transition-all duration-500 ease-in-out",
                            "bg-primary"
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    />

                    <div className="relative flex justify-between">
                        {LINEAR_STEPS.map((stepName, index) => {
                            const stepConfig = STATE_DICTIONARY[stepName];
                            const StepIcon = stepConfig.icon;

                            const isCompleted = activeIndex > index;
                            const isCurrent = activeIndex === index && !isExceptional;
                            const isFuture = activeIndex < index;
                            const isErrorStep = isExceptional && activeIndex === index;

                            return (
                                <div key={stepName} className="flex flex-col items-center gap-3 min-w-17.5 flex-1">

                                    <div
                                        className={cn(
                                            'h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shrink-0 border-2',
                                            isCompleted && 'bg-primary border-primary text-primary-foreground',
                                            isCurrent && 'bg-background border-primary text-primary ring-4 ring-primary/20',
                                            isFuture && 'bg-background border-muted text-muted-foreground',
                                            isErrorStep && 'bg-destructive border-destructive text-destructive-foreground ring-4 ring-destructive/20'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5 stroke-3" />
                                        ) : isErrorStep ? (
                                            <XCircle className="h-5 w-5" />
                                        ) : (
                                            <StepIcon className="h-4 w-4" />
                                        )}
                                    </div>

                                    <span
                                        className={cn(
                                            'text-[11px] sm:text-xs font-semibold text-center leading-tight',
                                            isCompleted && 'text-foreground',
                                            isCurrent && 'text-primary',
                                            isFuture && 'text-muted-foreground',
                                            isErrorStep && 'text-destructive'
                                        )}
                                    >
                                        {t(`tickets.status.${stepName}.name` as StatusNameTranslationKey)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}