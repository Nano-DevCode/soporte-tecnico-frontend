import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Barcode, Layers, Monitor, Package, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItAsset } from '../interfaces/itAssetsResponse.interface'

interface Props {
  itAsset: ItAsset;
  // Agregamos esta propiedad para saber en qué formulario estamos
  mode?: 'in' | 'out'; 
}

const CustomItAssetPreview = ({ itAsset, mode = 'out' }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="order-first md:order-last md:col-span-5 lg:col-span-4">
        <Card className="overflow-hidden border-primary/20 shadow-md">
        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-primary mt-0.5">
              {/* Cambiamos el título dinámicamente */}
              {mode === 'in' 
                ? t("itAssets.components.assetPreview.titleIn") 
                : t("itAssets.components.assetPreview.titleOut")}
            </h3>
            
            {/* 1. ID: Agregamos whitespace-normal, break-all y un max-w */}
            <Badge 
              variant="outline" 
              className="bg-background shadow-sm font-mono text-[10px] whitespace-normal break-all max-w-32.5 text-right"
            >
              #{itAsset.idInventary ?? itAsset.id}
            </Badge>
        </div>
        
        <div className="aspect-video w-full bg-muted/30 flex items-center justify-center p-4">
            {itAsset.imageUrl ? (
            <img 
                src={itAsset.imageUrl} 
                alt={t("itAssets.components.assetPreview.imageAlt")} 
                className="w-full h-full object-contain drop-shadow-md rounded-md"
            />
            ) : (
            <Monitor className="w-16 h-16 text-muted-foreground/30" strokeWidth={1.5} />
            )}
        </div>

        <CardContent className="p-5 space-y-4">
            <div>
            <h4 className="text-xl font-bold leading-none mb-1">{itAsset.model?.name}</h4>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                {itAsset.model?.brand?.name}
            </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> {t("itAssets.components.assetPreview.type")}
                  </span>
                  <span className="font-medium truncate">{itAsset.itAssetsType?.name}</span>
              </div>
              
              <div className="bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Barcode className="h-3 w-3" /> {t("itAssets.components.assetPreview.serial")}
                  </span>
                  {/* 2. SERIAL: Quitamos truncate y ponemos break-all whitespace-normal */}
                  <span className="font-mono text-xs break-all whitespace-normal leading-tight" title={itAsset.serialNumber}>
                  {itAsset.serialNumber || t("itAssets.components.assetPreview.na")}
                  </span>
              </div>

              {/* CAMPO: Estado Físico Actual */}
              <div className="col-span-2 bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {t("itAssets.components.assetPreview.statusLabel")}
                  </span>
                  <span className="font-medium truncate" title={itAsset.itAssetStatus?.name}>
                  {itAsset.itAssetStatus?.name || t("itAssets.components.assetPreview.statusUnknown")}
                  </span>
              </div>
            </div>

            {/* LÓGICA CONDICIONAL DE ADVERTENCIAS */}
            
            {/* 1. Si es SALIDA y el equipo ya está en uso */}
            {mode === 'out' && itAsset.inUse && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm mt-4 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-400">
                <strong className="block mb-1">{t("itAssets.components.assetPreview.warnings.outInUseTitle")}</strong>
                {t("itAssets.components.assetPreview.warnings.outInUseStart")}
                <b>{t("itAssets.components.assetPreview.warnings.outInUseBold")}</b>
                {t("itAssets.components.assetPreview.warnings.outInUseEnd")}
            </div>
            )}

            {/* 2. Si es ENTRADA y el equipo NO está en uso */}
            {mode === 'in' && !itAsset.inUse && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm mt-4 dark:bg-blue-950/50 dark:border-blue-900/50 dark:text-blue-400">
                <strong className="block mb-1">{t("itAssets.components.assetPreview.warnings.inNotInUseTitle")}</strong>
                {t("itAssets.components.assetPreview.warnings.inNotInUseStart")}
                <b>{t("itAssets.components.assetPreview.warnings.inNotInUseBold")}</b>
                {t("itAssets.components.assetPreview.warnings.inNotInUseEnd")}
            </div>
            )}

        </CardContent>
        </Card>
    </div>
  )
}

export default CustomItAssetPreview;