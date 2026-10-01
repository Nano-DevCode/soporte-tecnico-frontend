import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, Loader2, Smartphone, Laptop } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const CustomSessionsConfiguration = () => {
  const { t } = useTranslation();
  const { logoutAll } = useAuthStore();
  const [isPending, setIsPending] = useState(false);

  const handleLogoutAll = async () => {
    try {
      setIsPending(true);
      await logoutAll();
      toast.success(t("sessions_logout_all_success", "Todas las sesiones han sido cerradas exitosamente."));
    } catch {
      toast.error(t("sessions_logout_all_error", "Error al intentar cerrar las sesiones activas."));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          {t("sessions_configuration_title", "Seguridad y Sesiones Activas")}
        </CardTitle>
        <CardDescription>
          {t(
            "sessions_configuration_description",
            "Administra tus sesiones en navegadores y dispositivos conectados con rotación segura de tokens."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {t("sessions_current_device", "Sesión actual en este equipo")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(
                  "sessions_current_device_desc",
                  "Protegida con rotación periódica de tokens y cookies HttpOnly seguras."
                )}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("sessions_status_active", "Activa")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>
              {t(
                "sessions_logout_all_warning",
                "¿Sospechas de accesos no autorizados? Cierra todas las sesiones en cualquier navegador o celular."
              )}
            </span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 shrink-0"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {t("sessions_logout_all_button", "Cerrar todas las sesiones")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("sessions_logout_all_confirm_title", "¿Cerrar todas las sesiones?")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "sessions_logout_all_confirm_description",
                    "Esta acción revocará inmediatamente todos los tokens de actualización en el servidor. Tendrás que volver a iniciar sesión en este y en todos tus otros dispositivos."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common_cancel", "Cancelar")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutAll} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  {t("sessions_logout_all_confirm_action", "Sí, cerrar todas las sesiones")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
