import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Hash, Layers } from "lucide-react";
import { CustomToolActionsMenu } from "./CustomToolActionsMenu"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import type { Tool } from "../interfaces/toolsResponse"; 

interface Props {
  tools: Tool[];
  handleDownClick: (tool: Tool) => void;
}

export const CustomToolMobileCard = memo(({ tools, handleDownClick }: Props) => {
  return (
    <div className="md:hidden space-y-3">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        >
          {/* Avatar con las primeras 2 letras del Tipo */}
          <Avatar className="mt-0.5 h-10 w-10 shrink-0 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
              {tool.type.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            {/* Top: Tipo (Badge) */}
            <div className="flex items-start">
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                {tool.type.name}
              </span>
            </div>

            {/* ID Completo */}
            <p className="text-[10px] font-mono text-muted-foreground/60 break-all leading-tight">
              ID: {tool.id}
            </p>

            {/* Nombre/Descripción Principal */}
            <p className="text-sm font-bold text-foreground leading-snug whitespace-normal break-words">
              {tool.type.name} - {tool.model.brand.name}
            </p>

            {/* Detalles: Cantidad */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="whitespace-normal break-all leading-relaxed">
                Cantidad: <span className="font-semibold text-foreground">{tool.quantity}</span>
              </span>
            </div>

            {/* Detalles: Marca */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" />
              <span className="whitespace-normal break-words leading-relaxed">
                Marca: {tool.model.brand.name}
              </span>
            </div>

            {/* Status */}
            <div className="pt-1">
              <Badge
                variant="outline"
                className={cn(
                  "font-semibold text-[10px] px-2 py-0 rounded-full border-none", 
                  tool.status === true 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                    : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                )}
              >
                {tool.status ? t("custom_department_desktop_table_active") : t("custom_department_desktop_table_inactive")}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            {/* Menú de acciones */}
            <CustomToolActionsMenu 
              tool={tool} 
              handleDownClick={handleDownClick} 
            />
          </div>
        </div>
      ))}

      {/* Estado Vacío */}
      {tools.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {t("custom_department_desktop_table_not_found")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70 text-center px-4">
            {t("custom_department_desktop_table_setting_filters")}
          </p>
        </div>
      )}
    </div>
  );
});