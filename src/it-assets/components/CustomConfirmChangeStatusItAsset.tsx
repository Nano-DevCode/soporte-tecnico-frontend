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
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatusName?: string;
  onConfirm: () => void;
}

export const CustomConfirmChangeStatusItAsset = ({ 
  open, 
  onOpenChange, 
  currentStatusName, 
  onConfirm 
}: Props) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t("itAssets.components.confirmChangeStatus.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {t("itAssets.components.confirmChangeStatus.descriptionStart")}{' '}
            <span className="font-bold text-foreground">
              {currentStatusName || t("itAssets.components.confirmChangeStatus.unknownStatus")}
            </span>
            {t("itAssets.components.confirmChangeStatus.descriptionEnd")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="mt-0">
            {t("itAssets.components.confirmChangeStatus.cancel")}
          </AlertDialogCancel>
          {/* Al quitar las clases forzadas de fondo, Shadcn aplica automáticamente 
              bg-primary y text-primary-foreground según tu modo (claro/oscuro) */}
          <AlertDialogAction onClick={onConfirm}>
            {t("itAssets.components.confirmChangeStatus.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomConfirmChangeStatusItAsset;