import { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Barcode, LogIn, LogOut } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Link } from "react-router"; 
import { Button } from "@/components/ui/button";
import { CustomItAssetActionsMenu } from "./CustomToolActionsMenu";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";
import CustomNotFoundCatalog from "@/components/custom/CustomNotFoundCatalog";

interface Props {
  itAssets: ItAsset[];
  handleDownClick: (asset: ItAsset) => void;
}

export const CustomItAssetDesktopCatalog = memo(({ itAssets, handleDownClick }: Props) => {
  const { t } = useTranslation();

  if (itAssets.length === 0) {
    return (
      <CustomNotFoundCatalog
        title={t("itAssets.components.desktopCatalog.notFound.title")}
        description={t("itAssets.components.desktopCatalog.notFound.description")}
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
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20 flex items-center justify-center border-b border-border/40">
              
              {/* Etiqueta de ID flotante (Izquierda) */}
              <div className="absolute top-3 left-3 z-20">
                <Badge 
                  variant="outline" 
                  className="bg-background/90 backdrop-blur-md border-border/50 shadow-sm text-[10px] font-mono px-2 py-0.5 whitespace-normal break-all max-w-[130px] text-left leading-tight flex flex-col items-start gap-0.5"
                >
                  <span>#{asset.idInventary ?? asset.id}</span>
                </Badge>
              </div>

              {/* Badge de Disponibilidad flotante (Derecha - ARRIBA) */}
              <div className="absolute top-3 right-3 z-20">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border shadow-sm backdrop-blur-md",
                    asset.inUse 
                      ? "bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-900/60" 
                      : "bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-900/60"
                  )}
                >
                  {asset.inUse 
                    ? t("itAssets.components.desktopCatalog.availability.inUse") 
                    : t("itAssets.components.desktopCatalog.availability.available")}
                </Badge>
              </div>

              {/* Imagen del Activo */}
              {asset.imageUrl ? (
                <img 
                  src={asset.imageUrl} 
                  alt={asset.idInventary ?? t("itAssets.components.desktopCatalog.imageAlt")} 
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                    asset.inUse && "grayscale-[50%] opacity-80"
                  )}
                />
              ) : (
                <Monitor 
                  className={cn(
                    "w-14 h-14 transition-transform duration-500 group-hover:scale-110",
                    asset.inUse ? "text-muted-foreground/30" : "text-primary/20"
                  )} 
                  strokeWidth={1.5} 
                />
              )}
              
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none" />
            </div>

            {/* === CONTENIDO PRINCIPAL === */}
            <CardContent className="relative z-20 flex flex-1 flex-col p-5 gap-3.5">
              
              {/* Fila Superior: Tipo y Status */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest line-clamp-1">
                  {asset.itAssetsType?.name || "—"}
                </span>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn(
                    "h-2 w-2 rounded-full", 
                    asset.status ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-destructive"
                  )} />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {asset.status 
                      ? t("itAssets.components.desktopCatalog.status.active") 
                      : t("itAssets.components.desktopCatalog.status.inactive")}
                  </span>
                </div>
              </div>

              {/* Título (Modelo) y Marca */}
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">Modelo</span>
                  <h3 className="line-clamp-1 text-base font-bold tracking-tight text-foreground leading-snug" title={asset.model?.name}>
                    {asset.model?.name || "Sin modelo"}
                  </h3>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">Marca</span>
                  <p className="line-clamp-1 text-sm text-muted-foreground leading-snug" title={asset.model?.brand?.name}>
                    {asset.model?.brand?.name || "Sin marca"}
                  </p>
                </div>
              </div>

              {/* Serial Number */}
              <div className="mt-auto pt-2">
                <div className="flex items-start gap-2.5 rounded-md bg-muted/30 px-3 py-2">
                  <Barcode className="h-4 w-4 text-muted-foreground/70 shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">S/N (Serial)</span>
                    <span className="font-mono text-xs text-muted-foreground break-all whitespace-normal leading-tight" title={asset.serialNumber}>
                      {asset.serialNumber || t("itAssets.components.desktopCatalog.serialNumber.empty")}
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>

            {/* === FOOTER CON BOTONES DE ACCIÓN === */}
            <CardFooter className="p-4 bg-muted/10 border-t border-border/40 flex justify-between items-center gap-3">
              
              <div className="flex-1">
                {asset.inUse ? (
                  <Link 
                    to={`/it-assets/in/${asset.id}`} 
                    className={cn("block w-full", !asset.status && "pointer-events-none")}
                    onClick={(e) => !asset.status && e.preventDefault()}
                  >
                    <Button variant="secondary" size="sm" className="w-full gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 dark:hover:bg-amber-900/50" disabled={!asset.status}>
                      <LogIn className="h-4 w-4" />
                      {t("itAssets.components.desktopCatalog.buttons.in")}
                    </Button>
                  </Link>
                ) : (
                  <Link 
                    to={`/it-assets/out/${asset.id}`} 
                    className={cn("block w-full", !asset.status && "pointer-events-none")}
                    onClick={(e) => !asset.status && e.preventDefault()}
                  >
                    <Button variant="default" size="sm" className="w-full gap-2" disabled={!asset.status}>
                      <LogOut className="h-4 w-4" />
                      {t("itAssets.components.desktopCatalog.buttons.out")}
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

export default memo(CustomItAssetDesktopCatalog);