import { 
  Wrench, 
  Fingerprint, 
  CalendarDays,
  Tag,
  Layers,
  Boxes,
  Info
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Acciones y Componentes Custom
import { getOneToolActions } from "../actions/get-tool";
import { formatDate } from "@/users/util/formatDate"; // Ajusta la ruta si es necesario
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { cn } from "@/lib/utils";

export const ToolDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Consulta directa de la herramienta
  const { data: tool, error, isLoading } = useQuery({
    queryKey: ['tool', id],
    queryFn: () => getOneToolActions({ id: id! }),
    enabled: !!id,
    retry: 1, // Solo reintenta una vez para no hacer esperar al usuario si hay error 404
  });

  // Manejo de errores y redirección
  useEffect(() => {
    if (error || (!isLoading && !tool && id)) {
      sileo.error({
        title: "Herramienta no encontrada",
        description: "El registro no existe o ha sido eliminado.",
        duration: 3500,
      });

      navigate("/tools", { replace: true });
    }
  }, [error, tool, isLoading, navigate, id]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CustomBackToList onBack={() => navigate('/tools')} backLabel="Regresar a Herramientas" />
        <CustomSkeletonInformation/>
      </div>
    );
  }

  const renderDate = (dateString?: string | Date) => {
    return dateString ? formatDate(dateString) : <span className="text-muted-foreground italic">N/A</span>;
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      
      <CustomBackToList onBack={() => navigate('/tools')} backLabel="Regresar a Herramientas" actionUrl="tools"/>

      <Card>
        {/* ENCABEZADO */}
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Wrench className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold leading-none tracking-tight">
                {tool?.type?.name} {tool?.model?.name}
              </h3>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                Marca: <span className="text-foreground uppercase">{tool?.model?.brand?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={tool?.status ? "default" : "destructive"} 
              className={tool?.status ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
            >
              {tool?.status ? "Activo" : "Dado de Baja"}
            </Badge>

            <Badge 
              variant="secondary" 
              className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Boxes className="h-3 w-3" />
              Cantidad: {tool?.quantity}
            </Badge>
          </div>
        </CardHeader>

        {/* CONTENIDO (2 Columnas) */}
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          {/* COLUMNA 1: Datos de la herramienta */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Detalles de la Herramienta
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                
                <div className="space-y-1 sm:col-span-2">
                  <dt className="font-medium text-muted-foreground">ID del Registro</dt>
                  <dd className="font-mono text-xs text-foreground break-all flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {tool?.id || "N/A"}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">Tipo</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    {tool?.type?.name || "N/A"}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">Modelo</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    {tool?.model?.name || "N/A"}
                  </dd>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <dt className="font-medium text-muted-foreground">Descripción / Notas</dt>
                  <dd className="font-medium bg-muted/30 p-3 rounded-md border border-border/50 text-muted-foreground mt-1 flex items-start gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                    {tool?.description || "Sin descripción adicional."}
                  </dd>
                </div>

              </dl>
            </div>
          </div>

          {/* COLUMNA 2: Estado del Sistema e Historial */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Información del Sistema
              </h4>
              <dl className="grid grid-cols-1 gap-y-5 text-sm">
                
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">Estado Actual</dt>
                  <dd className={cn("font-bold text-base", tool?.status ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                    {tool?.status ? "Operativa en sistema" : "Suspendida / Inactiva"}
                  </dd>
                </div>

                <div className="rounded-lg bg-muted/30 p-3 border border-border/50 space-y-4">
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">Fecha de Creación</dt>
                    <dd className="font-semibold flex items-center gap-1.5 text-base">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {renderDate(tool?.createdAt)}
                    </dd>
                  </div>
                  
                  <div className="border-t pt-3">
                    <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">Última Modificación</dt>
                    <dd className="font-semibold flex items-center gap-1.5 text-base">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {renderDate(tool?.updatedAt)}
                    </dd>
                  </div>
                </div>

              </dl>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};