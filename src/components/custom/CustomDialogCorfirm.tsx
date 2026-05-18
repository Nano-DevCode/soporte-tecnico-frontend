import { memo } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ActionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: ReactNode;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
  icon: LucideIcon;
}

export const CustomDialogConfirm = memo(({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon: Icon,
}: ActionConfirmDialogProps) => {

  const variantStyles = {
    danger: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 ring-4 ring-red-50 dark:ring-red-900/20",
    primary: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 ring-4 ring-amber-50 dark:ring-amber-900/20",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 dark:bg-red-600 dark:hover:bg-red-500 dark:shadow-none",
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-none",
    warning: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-amber-950",
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] gap-0 overflow-hidden border-none p-0 sm:rounded-2xl">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
          <div className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-110 duration-300", 
            variantStyles[variant]
          )}>
            <Icon className="h-7 w-7" strokeWidth={2.5} />
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              {title}
            </AlertDialogTitle>
            
            <AlertDialogDescription asChild>
              <div className="text-sm leading-relaxed text-muted-foreground pt-2">
                {description}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 p-6 bg-muted/30 dark:bg-muted/10 border-t border-border/50">
          <AlertDialogCancel
            disabled={isLoading}
            className="sm:flex-1 rounded-xl border-border/50 bg-background hover:bg-muted font-medium"
          >
            {cancelText}
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              "sm:flex-1 rounded-xl font-bold text-black transition-all active:scale-95", 
              buttonStyles[variant]
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Procesando...</span>
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
