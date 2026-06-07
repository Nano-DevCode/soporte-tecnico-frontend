import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  ArrowDownRight, 
  ArrowUpRight, 
  Monitor, 
  Calendar, 
  FileText,  
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { ItAssetPreviewCard } from "../components/ItAssetPreviewCard"; 

import { useItAssetsMovements } from "../hooks/useItAssetsMovements";
import { TypeMovement } from "../interfaces/itAssetsMovementResponse";
import ItAssetMovementInDetails from "../components/ItAssetMovementInDetails";
import ItAssetMovementOutDetails from "../components/ItAssetMovementOutDetails";

export const ItAssetsMovementViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { itAssetMovement, isLoadingMovement, errorMovement } = useItAssetsMovements(id);

  if (isLoadingMovement) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <CustomSkeletonTableCard />
      </div>
    );
  }

  if (errorMovement || !itAssetMovement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Monitor className="h-12 w-12 text-muted-foreground/30" />
        <h2 className="text-xl font-bold">Movimiento no encontrado</h2>
        <p className="text-muted-foreground">El registro que buscas no existe o hubo un error al cargarlo.</p>
        <Button onClick={() => navigate(-1)} variant="outline">Regresar</Button>
      </div>
    );
  }

  const isInput = itAssetMovement.type === TypeMovement.IN;
  const asset = itAssetMovement.itAsset;
  
  const formattedDate = format(new Date(itAssetMovement.createdAt), "dd 'de' MMMM 'de' yyyy, hh:mm a", { locale: es });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="mt-1 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Detalle del Movimiento</h1>
            <Badge 
              variant="outline"
              className={`font-bold px-3 py-1 uppercase tracking-wider text-xs gap-1.5 shadow-sm
                ${isInput 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" 
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                }`}
            >
              {isInput ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {isInput ? "Entrada" : "Salida"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
            <Calendar className="h-3.5 w-3.5" />
            Registrado el {formattedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <ItAssetPreviewCard asset={asset} />

        {/* === Detalles del Movimiento === */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Datos del Registro de {isInput ? "Entrada" : "Salida"}
              </CardTitle>
              <CardDescription>
                Información administrativa guardada al momento exacto del movimiento.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              
              {/* Si es Salida */}
              {!isInput && itAssetMovement.movementOut && (
                <ItAssetMovementOutDetails itAssetMovement={itAssetMovement}/>
              )}

              {/* Si es Entrada */}
              {isInput && itAssetMovement.movementIn && (
                <ItAssetMovementInDetails itAssetMovement={itAssetMovement} />
              )}

              {((isInput && !itAssetMovement.movementIn) || (!isInput && !itAssetMovement.movementOut)) && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Info className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">No se encontraron detalles específicos de este movimiento.</p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};