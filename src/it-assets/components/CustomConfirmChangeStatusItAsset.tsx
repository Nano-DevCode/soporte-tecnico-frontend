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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            ¿Modificar estado del equipo?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            El sistema ha precargado el estado actual del equipo ({' '}
            <span className="font-bold text-foreground">
              {currentStatusName || "Desconocido"}
            </span>
            ). Si cambias este valor, se registrará la salida con el nuevo estado y se actualizará en el inventario. ¿Deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="mt-0">
            No, mantener estado
          </AlertDialogCancel>
          {/* Al quitar las clases forzadas de fondo, Shadcn aplica automáticamente 
              bg-primary y text-primary-foreground según tu modo (claro/oscuro) */}
          <AlertDialogAction onClick={onConfirm}>
            Sí, cambiar estado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};