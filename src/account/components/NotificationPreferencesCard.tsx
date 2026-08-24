import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Volume2 } from "lucide-react";
import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import { playNotificationSound } from "@/features/notifications/hooks/useNotificationSocket";
import { Button } from "@/components/ui/button";

const NOTIFICATION_TYPES = [
  { id: "TICKET_CREATED", label: "Ticket Creado", desc: "Cuando un nuevo ticket es generado" },
  { id: "TICKET_UPDATED", label: "Ticket Actualizado", desc: "Cuando los detalles de un ticket cambian" },
  { id: "TICKET_ASSIGNED", label: "Ticket Asignado", desc: "Cuando se te asigna un ticket para atención" },
  { id: "TICKET_ROUTED", label: "Ticket Canalizado", desc: "Cuando un ticket es reasignado a otra área" },
  { id: "TICKET_REJECTED", label: "Ticket Rechazado", desc: "Cuando una solicitud es rechazada" },
  { id: "TICKET_IN_PROGRESS", label: "Atención Iniciada", desc: "Cuando se empieza a trabajar en tu ticket" },
  { id: "TICKET_SOLVED", label: "Ticket Resuelto", desc: "Cuando un técnico reporta la solución" },
  { id: "TICKET_NOT_SOLVED", label: "Ticket No Resuelto", desc: "Cuando un técnico no pudo resolverlo" },
  { id: "TICKET_FINISHED", label: "Ticket Finalizado", desc: "Cuando se emite una orden de trabajo final" },
  { id: "TICKET_CLOSED", label: "Ticket Cerrado", desc: "Cuando un ticket se cierra de forma definitiva" }
];

export const NotificationPreferencesCard = () => {
  const { data: preferences, isLoading, updatePreferences, isUpdating } = useNotificationPreferences();

  if (isLoading) return null;

  const handleToggle = (type: string, checked: boolean) => {
    if (isUpdating) return;
    const newPreferences = {
      ...(preferences || {}),
      [type]: checked,
    };
    updatePreferences(newPreferences);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4 pt-5 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-base md:text-lg">Preferencias de Notificaciones en Sistema</CardTitle>
            </div>
            <CardDescription>
              Elige qué tipo de alertas deseas recibir en tiempo real dentro de la aplicación. Los correos y mensajes de Telegram no se ven afectados por esta configuración.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => playNotificationSound()} className="shrink-0">
            <Volume2 className="h-4 w-4 mr-2" />
            Probar sonido
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NOTIFICATION_TYPES.map((type) => {
            // Si la preferencia es undefined, asumimos true (activado por defecto)
            const isChecked = preferences?.[type.id] !== false;
            
            return (
              <div key={type.id} className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5 mr-4">
                  <Label className="text-sm font-semibold">{type.label}</Label>
                  <p className="text-xs text-muted-foreground">
                    {type.desc}
                  </p>
                </div>
                <Switch
                  checked={isChecked}
                  onCheckedChange={(checked) => handleToggle(type.id, checked)}
                  disabled={isUpdating}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
