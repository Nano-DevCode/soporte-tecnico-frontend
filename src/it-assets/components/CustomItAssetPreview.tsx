import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Barcode, Layers, Monitor, Package, Activity } from 'lucide-react'
import type { ItAsset } from '../interfaces/itAssetsResponse.interface'

interface Props {
  itAsset: ItAsset;
}

const CustomItAssetPreview = ({itAsset}: Props) => {
  return (
    // CAMBIO AQUI: 'order-first' fuerza a que sea el primer elemento en móvil.
    // En pantallas 'md' (tablets/escritorio) lo pasamos al final con 'md:order-last'
    <div className="order-first md:order-last md:col-span-5 lg:col-span-4">
        <Card className="overflow-hidden border-primary/20 shadow-md">
        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
            <h3 className="font-semibold text-primary">Equipo a despachar</h3>
            <Badge variant="outline" className="bg-background shadow-sm font-mono text-[10px]">
            #{itAsset.idInventary ?? itAsset.id.substring(0, 8)}
            </Badge>
        </div>
        
        <div className="aspect-video w-full bg-muted/30 flex items-center justify-center p-4">
            {itAsset.imageUrl ? (
            <img 
                src={itAsset.imageUrl} 
                alt="Activo" 
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
                  <Package className="h-3 w-3" /> Tipo
                  </span>
                  <span className="font-medium truncate">{itAsset.itAssetsType?.name}</span>
              </div>
              
              <div className="bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Barcode className="h-3 w-3" /> Serie
                  </span>
                  <span className="font-mono text-xs truncate" title={itAsset.serialNumber}>
                  {itAsset.serialNumber || "N/A"}
                  </span>
              </div>

              {/* CAMPO: Estado Físico Actual */}
              <div className="col-span-2 bg-muted/40 rounded p-2.5 flex flex-col gap-1 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Estado Físico Actual
                  </span>
                  <span className="font-medium truncate" title={itAsset.itAssetStatus?.name}>
                  {itAsset.itAssetStatus?.name || "Estado no definido"}
                  </span>
              </div>
            </div>

            {itAsset.inUse && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm mt-4 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-400">
                <strong className="block mb-1">⚠️ Atención</strong>
                Este equipo actualmente está marcado como <b>En Uso</b>. Por favor, asegúrate de registrar su entrada antes de asignarlo nuevamente.
            </div>
            )}
        </CardContent>
        </Card>
    </div>
  )
}

export default CustomItAssetPreview