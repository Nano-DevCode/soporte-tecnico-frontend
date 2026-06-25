import { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, LogIn, LogOut } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Link } from "react-router"; 
import { Button } from "@/components/ui/button";
import { CustomToolActionsMenu } from "./CustomToolActionsMenu";
import type { Tool } from "../interfaces/toolsResponse.interface";
import CustomNotFoundCatalog from "@/components/custom/CustomNotFoundCatalog";

interface Props {
  tools: Tool[];
  handleDownClick: (tool: Tool) => void;
}

export const CustomToolDesktopCatalog = memo(({ tools, handleDownClick }: Props) => {
  const { t } = useTranslation();

  if (tools.length === 0) {
    return (
      <CustomNotFoundCatalog
        title={t("tools.components.desktopCatalog.notFound.title")}
        description={t("tools.components.desktopCatalog.notFound.description")}
        icon={Monitor} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => {
        return (
          <Card 
            key={tool.id} 
            className="group relative flex flex-col overflow-hidden border-border/60 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <Link to={`/tools/${tool.id}`} className="flex flex-col flex-1 cursor-pointer">
              {/* === ÁREA DE IMAGEN === */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/20 flex items-center justify-center border-b border-border/40">
                
                {/* ID flotante (Sin restricciones de ancho) */}
                <div className="absolute top-3 left-3 z-20">
                  <Badge 
                    variant="outline" 
                    className="bg-background/90 backdrop-blur-md border-border/50 shadow-sm text-[10px] font-mono px-2 py-0.5 whitespace-nowrap flex items-center"
                  >
                    <span>#{tool.idInventary ?? tool.id}</span>
                  </Badge>
                </div>

                {/* Badge de Disponibilidad */}
                <div className="absolute top-3 right-3 z-20">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border shadow-sm backdrop-blur-md",
                      tool.inUse 
                        ? "bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-900/60" 
                        : "bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-900/60"
                    )}
                  >
                    {tool.inUse 
                      ? t("tools.components.desktopCatalog.availability.inUse") 
                      : t("tools.components.desktopCatalog.availability.available")}
                  </Badge>
                </div>

                {tool.imageUrl ? (
                  <img 
                    src={tool.imageUrl} 
                    alt={t("tools.components.desktopCatalog.imageAlt")} 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                      tool.inUse && "grayscale-50 opacity-80"
                    )}
                  />
                ) : (
                  <Monitor 
                    className={cn(
                      "w-14 h-14 transition-transform duration-500 group-hover:scale-110",
                      tool.inUse ? "text-muted-foreground/30" : "text-primary/20"
                    )} 
                    strokeWidth={1.5} 
                  />
                )}
                
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/5 to-transparent z-10 pointer-events-none" />
              </div>

              {/* === CONTENIDO PRINCIPAL === */}
              <CardContent className="relative z-20 flex flex-1 flex-col p-5 gap-3.5">
                
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest line-clamp-1">
                    {tool.toolType?.name || "—"}
                  </span>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn(
                      "h-2 w-2 rounded-full", 
                      tool.status ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-destructive"
                    )} />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {tool.status 
                        ? t("tools.components.desktopCatalog.status.active") 
                        : t("tools.components.desktopCatalog.status.inactive")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">Modelo</span>
                    <h3 className="line-clamp-1 text-base font-bold tracking-tight text-foreground leading-snug" title={tool.model?.name}>
                      {tool.model?.name || "Sin modelo"}
                    </h3>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">Marca</span>
                    <p className="line-clamp-1 text-sm text-muted-foreground leading-snug" title={tool.model?.brand?.name}>
                      {tool.model?.brand?.name || "Sin marca"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>

            <CardFooter className="p-4 bg-muted/10 border-t border-border/40 flex justify-between items-center gap-3 relative z-30">
              <div className="flex-1">
                {tool.inUse ? (
                  <Link 
                    to={`/tools/in/${tool.id}`} 
                    className={cn("block w-full", !tool.status && "pointer-events-none")}
                    onClick={(e) => !tool.status && e.preventDefault()}
                  >
                    <Button variant="secondary" size="sm" className="w-full gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 dark:hover:bg-amber-900/50" disabled={!tool.status}>
                      <LogIn className="h-4 w-4" />
                      {t("tools.components.desktopCatalog.buttons.in")}
                    </Button>
                  </Link>
                ) : (
                  <Link 
                    to={`/tools/out/${tool.id}`} 
                    className={cn("block w-full", !tool.status && "pointer-events-none")}
                    onClick={(e) => !tool.status && e.preventDefault()}
                  >
                    <Button variant="default" size="sm" className="w-full gap-2" disabled={!tool.status}>
                      <LogOut className="h-4 w-4" />
                      {t("tools.components.desktopCatalog.buttons.out")}
                    </Button>
                  </Link>
                )}
              </div>
              <CustomToolActionsMenu tool={tool} handleDownClick={handleDownClick} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
});

export default memo(CustomToolDesktopCatalog);