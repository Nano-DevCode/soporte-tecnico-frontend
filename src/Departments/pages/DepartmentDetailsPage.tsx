import { 
  Building2, 
  Hash, 
  Tag, 
  Fingerprint, 
  Type,
  Activity,
  CalendarDays,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDepartment } from "../hooks/useDepartment";
import { formatDate } from "@/users/util/formatDate";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";

export const DepartmentDetailsPage = () => {
  const navigate = useNavigate();
  const { department, error, isLoading } = useDepartment();

  useEffect(() => {
    if (error || (!isLoading && !department)) {
      sileo.error({
        title: "Departamento no encontrado",
        description: `${error?.message}`,
        duration: 2500,
      });

      navigate("/department", { replace: true });
    }
  }, [error, department, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <button 
          disabled
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar al listado de todos los departamentos 
        </button>
        <CustomSkeletonInformation/>
      </div>
    );
  }

  return (
    // Envolvemos todo en un div padre para separar el botón de la tarjeta
    <div className="mx-auto w-full max-w-3xl space-y-4">
      
      {/* Botón de Regresar */}
      <button 
        onClick={() => navigate('/department')}
        className="group flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Regresar al listado de todos los departamentos
      </button>

      {/* Tarjeta de Detalles */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground leading-none">
                {department?.name}
              </h3>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 pt-1">
                <Type className="h-4 w-4" />
                Acrónimo: <span className="text-foreground">{department?.acronym}</span>
              </p>
            </div>
          </div>
          
          <Badge
            variant="outline"
            className={cn(
              "w-fit px-3 py-1 font-bold uppercase tracking-wider text-[10px] border-none",
              department?.status
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
            )}
          >
            {department?.status ? "Operativo" : "Suspendido"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="group flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/50">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Fingerprint className="h-4 w-4 text-primary/70" />
              Identificador (UUID)
            </span>
            <span className="text-sm font-mono text-foreground break-all">
              {department?.id}
            </span>
          </div>

          <div className="group flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/50">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Tag className="h-4 w-4 text-primary/70" />
              Nivel de Prioridad
            </span>
            <span className="text-sm font-semibold text-foreground">
              {department?.priority}
            </span>
          </div>

          <div className="group flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/50">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Hash className="h-4 w-4 text-primary/70" />
              Folio Actual
            </span>
            <span className="text-sm font-semibold text-foreground">
              {department?.folio}
            </span>
          </div>

          <div className="group flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/50">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-4 w-4 text-primary/70" />
              Estado Lógico
            </span>
            <span className="text-sm font-semibold text-foreground">
              {department?.status ? "Habilitado para asignaciones" : "Deshabilitado en el sistema"}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-muted/40 p-4 border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-background p-2 shadow-sm border border-border/50">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Fecha de Creación</span>
                <span className="text-sm font-medium text-foreground">{formatDate(department?.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-md bg-background p-2 shadow-sm border border-border/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Última Actualización</span>
                <span className="text-sm font-medium text-foreground">{formatDate(department?.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};