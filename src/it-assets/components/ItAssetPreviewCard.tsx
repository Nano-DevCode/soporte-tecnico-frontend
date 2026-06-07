import { Monitor, Layers, Tag, Receipt, Info, Box, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface Props {
  asset: ItAsset;
}

export const ItAssetPreviewCard = ({ asset }: Props) => {
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
              {asset.status ? "ACTIVO" : "INACTIVO"}
            </Badge>
          </div>

          {asset.imageUrl ? (
            <img 
              src={asset.imageUrl} 
              alt={`Activo ${asset.serialNumber}`} 
              className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              <Monitor className="h-16 w-16" />
              <span className="text-xs font-semibold uppercase tracking-widest">Sin Imagen</span>
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
                Ficha del Activo
              </p>
            </div>
            <h3 className="text-xl font-black leading-none text-foreground mb-2">
              {asset.serialNumber}
            </h3>
            <div className="inline-flex items-center rounded-md bg-muted/60 px-2 py-1 text-xs font-mono text-muted-foreground border border-border/50">
              ID: {asset.idInventary || "Sin ID asignado"}
            </div>
          </div>

          {/* Lista de Detalles Estilizada */}
          <div className="bg-muted/20 rounded-xl border border-border/50 p-4 space-y-4">
            
            <PreviewRow 
              icon={Tag} 
              label="Tipo" 
              value={asset.itAssetsType?.name || "N/A"} 
            />
            
            <div className="flex items-start justify-between text-sm group">
              <span className="text-muted-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground/70" /> 
                <span>Modelo</span>
              </span>
              <div className="text-right">
                <span className="font-semibold text-foreground block">
                  {asset.model?.name || "N/A"}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {asset.model?.brand?.name || "Sin Marca"}
                </span>
              </div>
            </div>

            <PreviewRow 
              icon={Info} 
              label="Estado Físico" 
              value={asset.itAssetStatus?.name || "N/A"} 
            />

            <PreviewRow 
              icon={Receipt} 
              label="Factura" 
              value={asset.invoice?.idInternal || "Sin factura"} 
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
    "flex items-center justify-between text-sm pb-3",
    !isLast && "border-b border-border/50"
  )}>
    <span className="text-muted-foreground flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground/70" /> 
      <span>{label}</span>
    </span>
    <span className="font-semibold text-foreground text-right">
      {value}
    </span>
  </div>
);