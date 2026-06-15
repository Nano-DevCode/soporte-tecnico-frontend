import { Monitor, Layers, Tag, Receipt, Info, Box, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface Props {
  asset: ItAsset;
}

export const ItAssetPreviewCard = ({ asset }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="md:col-span-1 space-y-6 md:sticky md:top-24">
      <Card className="overflow-hidden shadow-md border-border/60 transition-all duration-300 hover:shadow-lg">
        
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-muted/50 via-muted to-muted/80 flex items-center justify-center p-6 border-b border-border/50 group">
          
          {/* Badge de estado flotante sobre la imagen */}
          <div className="absolute top-3 right-3 z-10">
            <Badge 
              variant="secondary" 
              className={cn(
                "shadow-sm backdrop-blur-md bg-background/80 border-border/50 font-bold",
                asset.status ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}
            >
              {asset.status 
                ? t("itAssets.components.assetPreviewCard.status.active") 
                : t("itAssets.components.assetPreviewCard.status.inactive")}
            </Badge>
          </div>

          {asset.imageUrl ? (
            <img 
              src={asset.imageUrl} 
              alt={t("itAssets.components.assetPreviewCard.imageAlt", { serial: asset.serialNumber })} 
              className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              <Monitor className="h-16 w-16" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {t("itAssets.components.assetPreviewCard.noImage")}
              </span>
            </div>
          )}
        </div>
        
        {/* === ÁREA DE INFORMACIÓN === */}
        <CardContent className="p-6 space-y-6">
          
          {/* Cabecera del Activo */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Box className="h-4 w-4 text-primary" />
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                {t("itAssets.components.assetPreviewCard.title")}
              </p>
            </div>
            {/* Se agregó break-all, whitespace-normal y se ajustó el leading */}
            <h3 className="text-xl font-black leading-tight text-foreground mb-2 break-all whitespace-normal">
              {asset.serialNumber}
            </h3>
            {/* Se agregó break-all y whitespace-normal para que el ID rompa línea si es muy largo */}
            <div className="inline-flex items-center rounded-md bg-muted/60 px-2 py-1 text-xs font-mono text-muted-foreground border border-border/50 break-all whitespace-normal text-left">
              {t("itAssets.components.assetPreviewCard.id")}: {asset.idInventary || t("itAssets.components.assetPreviewCard.noId")}
            </div>
          </div>

          {/* Lista de Detalles Estilizada */}
          <div className="bg-muted/20 rounded-xl border border-border/50 p-4 space-y-4">
            
            <PreviewRow 
              icon={Tag} 
              label={t("itAssets.components.assetPreviewCard.details.type")} 
              value={asset.itAssetsType?.name || t("itAssets.components.assetPreviewCard.details.na")} 
            />
            
            <div className="flex items-start justify-between text-sm group">
              <span className="text-muted-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground/70" /> 
                <span>{t("itAssets.components.assetPreviewCard.details.model")}</span>
              </span>
              <div className="text-right">
                {/* Agregado break-all al nombre del modelo por precaución */}
                <span className="font-semibold text-foreground block break-all whitespace-normal text-right">
                  {asset.model?.name || t("itAssets.components.assetPreviewCard.details.na")}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {asset.model?.brand?.name || t("itAssets.components.assetPreviewCard.details.noBrand")}
                </span>
              </div>
            </div>

            <PreviewRow 
              icon={Info} 
              label={t("itAssets.components.assetPreviewCard.details.status")} 
              value={asset.itAssetStatus?.name || t("itAssets.components.assetPreviewCard.details.na")} 
            />

            <PreviewRow 
              icon={Receipt} 
              label={t("itAssets.components.assetPreviewCard.details.invoice")} 
              value={asset.invoice?.idInternal || t("itAssets.components.assetPreviewCard.details.noInvoice")} 
              isLast
            />
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PreviewRow = ({ icon: Icon, label, value, isLast }: { icon: LucideIcon, label: string, value: string, isLast?: boolean }) => (
  <div className={cn(
    "flex items-start justify-between text-sm pb-3", // Cambiado items-center a items-start
    !isLast && "border-b border-border/50"
  )}>
    <span className="text-muted-foreground flex items-center gap-2 pt-0.5 shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground/70" /> 
      <span>{label}</span>
    </span>
    {/* Se agregó text-right, break-all y whitespace-normal a los valores de las filas */}
    <span className="font-semibold text-foreground text-right break-all whitespace-normal pl-2">
      {value}
    </span>
  </div>
);