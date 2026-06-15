import React from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener esta utilidad (típica en Shadcn)

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  isTextarea?: boolean;
}

const DetailItem = ({ icon: Icon, label, value, subValue, isTextarea }: DetailItemProps) => {
  return (
    <div className={cn("flex flex-col gap-2", isTextarea && "w-full col-span-full")}>
      
      {/*Icono*/}
      <div className="flex items-center gap-2.5">
        {/* Recuadro sutil para el ícono */}
        <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
          <Icon className="h-3.5 w-3.5 text-foreground/70" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      
      {/* Contenido */}
      <div className={cn(!isTextarea && "pl-1")}>
        {isTextarea ? (
          // Bloque de nota (Añadido break-words por seguridad)
          <div className="bg-muted/10 p-4 rounded-lg border border-border/60 text-sm text-foreground whitespace-pre-wrap break-words min-h-[80px] leading-relaxed shadow-sm transition-colors hover:bg-muted/20">
            {value}
          </div>
        ) : (
          // Estilo de texto normal con sub-valor
          <div className="space-y-0.5">
            {/* SE AGREGÓ "break-all" AQUÍ */}
            <p className="text-sm font-semibold text-foreground leading-snug break-all">
              {value}
            </p>
            {subValue && (
              <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed break-all">
                {/* SE AGREGÓ "break-all" AQUÍ */}
                {subValue}
              </p>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default DetailItem;