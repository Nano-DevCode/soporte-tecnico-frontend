import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Layers, Monitor, Package, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Tool } from '../interfaces/toolsResponse.interface'

interface Props {
  tool: Tool;
  // Agregamos esta propiedad para saber en qué formulario estamos
  mode?: 'in' | 'out'; 
}

const CustomToolPreview = ({ tool, mode = 'out' }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="order-first md:order-last md:col-span-5 lg:col-span-4">
        <Card className="overflow-hidden border-primary/20 shadow-md">
        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-primary mt-0.5">
              {/* Cambiamos el título dinámicamente */}
              {mode === 'in' 
                ? t("tools.components.assetPreview.titleIn") 
                : t("tools.components.assetPreview.titleOut")}
            </h3>
            
            {/* 1. ID: Agregamos whitespace-normal, break-all y un max-w */}
            <Badge 
              variant="outline" 
              className="bg-background shadow-sm font-mono text-[10px] whitespace-normal break-all max-w-32.5 text-right"
            >
              #{tool.idInventary ?? tool.id}
            </Badge>
        </div>
        
        <div className="aspect-video w-full bg-muted/30 flex items-center justify-center p-4">
            {tool.imageUrl ? (
            <img 
                src={tool.imageUrl} 
                alt={t("tools.components.assetPreview.imageAlt")} 
                className="w-full h-full object-contain drop-shadow-md rounded-md"
            />
            ) : (
            <Monitor className="w-16 h-16 text-muted-foreground/30" strokeWidth={1.5} />
            )}
        </div>

        <CardContent className="p-5 space-y-4">
            <div>
            <h4 className="text-xl font-bold leading-none mb-1">{tool.model?.name}</h4>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                {tool.model?.brand?.name}
            </p>
            </div>

            {/* Cambiamos a grid-cols-1 para que el Tipo y el Estado se apilen perfectamente sin huecos */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> {t("tools.components.assetPreview.type")}
                  </span>
                  <span className="font-medium truncate">{tool.toolType?.name}</span>
              </div>

              {/* CAMPO: Estado Físico Actual */}
              <div className="bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {t("tools.components.assetPreview.statusLabel")}
                  </span>
                  <span className="font-medium truncate" title={tool.toolStatus?.name}>
                  {tool.toolStatus?.name || t("tools.components.assetPreview.statusUnknown")}
                  </span>
              </div>
            </div>

            {/* LÓGICA CONDICIONAL DE ADVERTENCIAS */}
            
            {/* 1. Si es SALIDA y el equipo ya está en uso */}
            {mode === 'out' && tool.inUse && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm mt-4 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-400">
                <strong className="block mb-1">{t("tools.components.assetPreview.warnings.outInUseTitle")}</strong>
                {t("tools.components.assetPreview.warnings.outInUseStart")}
                <b>{t("tools.components.assetPreview.warnings.outInUseBold")}</b>
                {t("tools.components.assetPreview.warnings.outInUseEnd")}
            </div>
            )}

            {/* 2. Si es ENTRADA y el equipo NO está en uso */}
            {mode === 'in' && !tool.inUse && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm mt-4 dark:bg-blue-950/50 dark:border-blue-900/50 dark:text-blue-400">
                <strong className="block mb-1">{t("tools.components.assetPreview.warnings.inNotInUseTitle")}</strong>
                {t("tools.components.assetPreview.warnings.inNotInUseStart")}
                <b>{t("tools.components.assetPreview.warnings.inNotInUseBold")}</b>
                {t("tools.components.assetPreview.warnings.inNotInUseEnd")}
            </div>
            )}

        </CardContent>
        </Card>
    </div>
  )
}

export default CustomToolPreview;