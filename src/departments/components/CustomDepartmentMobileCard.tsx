import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Hash, Tag } from "lucide-react";
import { CustomDepartmentActionsMenu } from "./CustomDepartmentActionsMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Department } from "../interfaces/department.interface";

interface Props {
  departments: Department[];
  handleDownClick: (department: Department) => void;
}

export const CustomDepartmentMobileCard = memo(({ departments, handleDownClick }: Props) => {
  return (
    <div className="md:hidden space-y-3">
      {departments.map((department) => (
        <div
          key={department.id}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        >
          {/* Avatar con el Acrónimo o las primeras 2 letras del nombre */}
          <Avatar className="mt-0.5 h-10 w-10 shrink-0 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
              {department.acronym 
                ? department.acronym.substring(0, 3) 
                : department.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            {/* Top: Acrónimo (Badge) + ID Corto */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {department.acronym || 'S/A'}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                ID: {department.id}
              </span>
            </div>

            {/* Nombre del Departamento */}
            <p className="text-sm font-bold text-foreground leading-snug whitespace-normal wrap-break-word">
              {department.name}
            </p>

            {/* Folio */}
            {department.folio && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span className="whitespace-normal break-all leading-relaxed">
                  Folio: {department.folio}
                </span>
              </div>
            )}

            {/* Prioridad */}
            {department.priority && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span className="whitespace-normal wrap-break-word leading-relaxed">
                  Prioridad: {department.priority}
                </span>
              </div>
            )}

            {/* Status */}
            <div className="pt-1">
              <Badge
                variant="outline"
                className={cn(
                  "font-semibold text-[10px] px-2 py-0 rounded-full border-none", 
                  department.status === true 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                    : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                )}
              >
                {department.status === true ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            {/* Menú de acciones */}
            <CustomDepartmentActionsMenu 
              department={department} 
              handleDownClick={handleDownClick} 
            />
          </div>
        </div>
      ))}

      {/* Estado Vacío */}
      {departments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No se encontraron departamentos
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70 text-center px-4">
            Intenta ajustar los filtros de búsqueda o crea un nuevo departamento
          </p>
        </div>
      )}
    </div>
  )
});