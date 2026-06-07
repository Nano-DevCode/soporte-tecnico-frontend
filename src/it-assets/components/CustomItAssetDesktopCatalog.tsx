import { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Barcode, LogIn, LogOut } from "lucide-react"; 
import { t } from "i18next";
import { cn } from "@/lib/utils";
import { Link } from "react-router"; // Importación necesaria para redireccionar
import { Button } from "@/components/ui/button";
import { CustomItAssetActionsMenu } from "./CustomToolActionsMenu";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";
import CustomNotFoundCatalog from "@/components/custom/CustomNotFoundCatalog";

interface Props {
  itAssets: ItAsset[];
  handleDownClick: (asset: ItAsset) => void;
}

export const CustomItAssetDesktopCatalog = memo(({ itAssets, handleDownClick }: Props) => {
  
  if (itAssets.length === 0) {
    return (
      <CustomNotFoundCatalog
        title={t("itAssets.notFound.title", "No se encontraron activos")}
        description={t("itAssets.notFound.description", "No hay activos de TI que coincidan con tu búsqueda. Intenta con otros filtros.")}
        icon={Monitor} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {itAssets.map((asset) => {
        return (
          <Card 
            key={asset.id} 
            className="group relative flex flex-col overflow-hidden border-border/60 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            {/* === ÁREA DE IMAGEN === */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30 flex items-center justify-center">
              
              {/* Etiqueta de ID flotante (Izquierda) */}
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="outline" className="bg-background/90 backdrop-blur-md border-border/50 shadow-sm text-[10px] font-mono px-2 py-0.5">
                  #{asset.idInventary ?? asset.id.substring(0, 8)}
                </Badge>
              </div>

              {/* Badge de Disponibilidad flotante (Derecha - ARRIBA) */}
              <div className="absolute top-3 right-3 z-20">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 border shadow-sm backdrop-blur-md",
                    asset.inUse 
                      ? "bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-900/60" 
                      : "bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-900/60"
                  )}
                >
                  {asset.inUse ? "En Uso" : "Disponible"}
                </Badge>
              </div>

              {/* Imagen del Activo */}
              {asset.imageUrl ? (
                <img 
                  src={asset.imageUrl} 
                  alt={asset.idInventary ?? "Imagen del activo"} 
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                    asset.inUse && "grayscale opacity-75"
                  )}
                />
              ) : (
                <Monitor 
                  className={cn(
                    "w-16 h-16 transition-transform duration-500 group-hover:scale-110",
                    asset.inUse ? "text-muted-foreground/30" : "text-primary/20"
                  )} 
                  strokeWidth={1.5} 
                />
              )}

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
            </div>

            {/* === CONTENIDO PRINCIPAL === */}
            <CardContent className="relative z-20 flex flex-1 flex-col p-5 pt-2">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {asset.itAssetsType?.name}
                </span>
                
                <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-full">
                  <span className={cn(
                    "h-2 w-2 rounded-full", 
                    asset.status ? "bg-emerald-500 animate-pulse" : "bg-destructive"
                  )} />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {asset.status ? t("itAssets.listTable.active", "Activo") : t("itAssets.listTable.inactive", "Inactivo")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground" title={asset.model?.name}>
                  {asset.model?.name}
                </h3>
                <p className="line-clamp-1 text-sm text-muted-foreground font-medium" title={asset.model?.brand?.name}>
                  {asset.model?.brand?.name}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-md bg-muted/40 p-2 border border-border/50">
                <Barcode className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-muted-foreground truncate" title={asset.serialNumber}>
                  {asset.serialNumber || "Sin número de serie"}
                </span>
              </div>

            </CardContent>

            {/* === FOOTER CON BOTONES DE ACCIÓN === */}
            <CardFooter className="p-3 px-5 bg-muted/10 border-t border-border/50 flex justify-between items-center mt-auto gap-3">
              
              <div className="flex-1">
                {asset.inUse ? (
                  <Link 
                    to={`/it-assets/in/${asset.id}`} 
                    className={cn("block w-full", !asset.status && "pointer-events-none")}
                    onClick={(e) => !asset.status && e.preventDefault()}
                  >
                    <Button variant="secondary" size="sm" className="w-full gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 dark:hover:bg-amber-900/50" disabled={!asset.status}>
                      <LogIn className="h-4 w-4" />
                      Entrada
                    </Button>
                  </Link>
                ) : (
                  // Botón si está Disponible -> Redirige a hacer una SALIDA
                  <Link 
                    to={`/it-assets/out/${asset.id}`} 
                    className={cn("block w-full", !asset.status && "pointer-events-none")}
                    onClick={(e) => !asset.status && e.preventDefault()}
                  >
                    <Button variant="default" size="sm" className="w-full gap-2" disabled={!asset.status}>
                      <LogOut className="h-4 w-4" />
                      Salida
                    </Button>
                  </Link>
                )}
              </div>

              {/* Menú de acciones extra en la derecha */}
              <CustomItAssetActionsMenu asset={asset} handleDownClick={handleDownClick} />
            </CardFooter>

          </Card>
        );
      })}
    </div>
  );
});
