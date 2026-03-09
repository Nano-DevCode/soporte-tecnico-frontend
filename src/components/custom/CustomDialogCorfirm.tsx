
import { Loader2, type LucideIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next';

interface ActionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  isLoading?: boolean
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary';
  icon: LucideIcon;
}

export const CustomDialogConfirm = ({
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

  const { t } = useTranslation();
  
  const variantStyles = {
    danger: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    primary: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  }

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
    primary: "bg-primary hover:bg-primary/90 focus:ring-primary",
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", variantStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
          {description}
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); 
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(buttonStyles[variant])}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("custom_dialog_confirm_loading")}
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}