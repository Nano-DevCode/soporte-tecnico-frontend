import { memo, useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Wrench, Package, Briefcase, Trash2, Lock } from "lucide-react";
import { t } from "i18next";
import type { Tool } from "../interfaces/toolsResponse";
import { CustomToolActionsMenu } from "./CustomToolActionsMenu";
import CustomNotFoundTable from "@/components/custom/CustomNotFoundTable";

// Utilidad para clases (Asegúrate de tenerla importada)
import { cn } from "@/lib/utils";

// Importamos las funciones preparadas para IDs
import { addToToolBag, removeFromToolBag, TOOL_BAG_EVENT } from "./CustomToolBag"; 

interface Props {
  tools: Tool[];
  handleDownClick: (tool: Tool) => void;
}

export const CustomToolDesktopCatalog = memo(({ tools, handleDownClick }: Props) => {
  const [bagToolIds, setBagToolIds] = useState<string[]>([]);

  const loadBagIds = useCallback(() => {
    const currentBag: string[] = JSON.parse(localStorage.getItem("custom_tool_bag") || "[]");
    setBagToolIds(currentBag); 
  }, []);

  useEffect(() => {
    loadBagIds();
    window.addEventListener(TOOL_BAG_EVENT, loadBagIds);
    return () => window.removeEventListener(TOOL_BAG_EVENT, loadBagIds);
  }, [loadBagIds]);

  if (tools.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CustomNotFoundTable 
          title={t("tools.notFound.title", "No se encontraron herramientas")}
          description={t("tools.notFound.description", "No hay herramientas disponibles en este momento")}
          icon={Wrench}
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tools.map((tool) => {
        const isAdded = bagToolIds.includes(tool.id);
        const isUnavailable = !tool.status || tool.inUse;

        return (
          <Card key={tool.id} className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-square w-full bg-secondary/30 flex flex-col items-center justify-center border-b border-border relative overflow-hidden group">
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-background/80 backdrop-blur-sm text-muted-foreground text-[10px] font-mono px-2 py-1 rounded-md border border-border shadow-sm">
                  #{tool.idInternal ?? tool.id.substring(0, 8)}
                </span>
              </div>

              {tool.imageUrl ? (
                <img 
                  src={tool.imageUrl} 
                  alt={tool.id ?? "Imagen de la herramienta"} 
                  className={`w-full h-full object-cover transition-transform duration-300 ${tool.inUse ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
                />
              ) : (
                <Wrench className={`w-20 h-20 transition-transform duration-300 ${tool.inUse ? 'text-muted-foreground/30' : 'text-primary/20 group-hover:scale-110'}`} strokeWidth={1.5} />
              )}
            </div>

            {/* ENCABEZADO */}
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent text-[10px] font-bold uppercase tracking-wider">
                    {tool.type.name}
                  </Badge>
                  <Badge variant={tool.status ? "default" : "destructive"} className="text-[10px] uppercase font-semibold px-2 py-0.5 shadow-none">
                    {tool.status ? t("tools.listTable.active", "Activa") : t("tools.listTable.inactive", "Inactiva ")}
                  </Badge>
                </div>
                
                {/* BADGE: En Uso / Disponible */}
                <div className="flex justify-start">
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                      tool.inUse 
                        ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" 
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    }`}
                  >
                    {tool.inUse ? "En Uso" : "Disponible"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            {/* CONTENIDO */}
            <CardContent className="p-4 pt-0 flex flex-col flex-1 gap-2 mt-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="line-clamp-1" title={tool.model.brand.name}>
                  Marca: {tool.model.brand.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-auto pt-2">
                <Package className="h-4 w-4 shrink-0" />
                <span>Modelo: <strong className="text-foreground">{tool.model.name}</strong></span>
              </div>
            </CardContent>

            {/* PIE DE TARJETA */}
            <CardFooter className="p-3 bg-muted/20 border-t border-border flex justify-between items-center mt-auto gap-2">
              
              {/* BOTÓN CON DISEÑO ADAPTATIVO */}
              <Button 
                size="sm" 
                variant={isUnavailable ? "secondary" : isAdded ? "outline" : "default"}
                className={cn(
                  "flex-1 gap-2 text-xs transition-all",
                  // Estilos hermosos para el botón "Quitar" (Fondo rojo suave en claro, translúcido en oscuro)
                  isAdded && !isUnavailable && "border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-500 dark:hover:bg-red-900 dark:hover:text-white",
                  // Estilo gris sólido para cuando está "Ocupada/Inactiva"
                  isUnavailable && "bg-muted text-muted-foreground opacity-100 dark:bg-muted/50 border-transparent"
                )}
                onClick={() => isAdded ? removeFromToolBag(tool.id) : addToToolBag(tool.id)}
                disabled={isUnavailable}
              >
                {tool.inUse ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Ocupada
                  </>
                ) : isAdded ? (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {t("tools.catalog.remove", "Quitar")}
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    {t("tools.catalog.add", "Agregar")}
                  </>
                )}
              </Button>

              <CustomToolActionsMenu tool={tool} handleDownClick={handleDownClick} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
});

CustomToolDesktopCatalog.displayName = "CustomToolDesktopCatalog";