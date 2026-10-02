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
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { ToolPreviewCard } from "../components/ToolPreviewCard"; 

import { useToolsMovements } from "../hooks/useToolsMovements";
import { TypeMovement } from "../interfaces/toolsMovementResponse";
import ItAssetMovementInDetails from "../components/ToolMovementInDetails";
import ItAssetMovementOutDetails from "../components/ToolsMovementOutDetails";

const ToolsMovementViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { toolsMovement, isLoadingMovement, errorMovement } = useToolsMovements(id);

  if (isLoadingMovement) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <CustomSkeletonTableCard />
      </div>
    );
  }

  if (errorMovement || !toolsMovement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Monitor className="h-12 w-12 text-muted-foreground/30" />
        <h2 className="text-xl font-bold">{t("tools.movementViewPage.notFound.title")}</h2>
        <p className="text-muted-foreground">{t("tools.movementViewPage.notFound.description")}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          {t("tools.movementViewPage.notFound.button")}
        </Button>
      </div>
    );
  }

  const isInput = toolsMovement.type === TypeMovement.IN;
  const tool = toolsMovement.tool;
  
  // Puedes dejar 'date-fns' con 'es' hardcodeado si la app es solo en español, o condicionarlo luego con el idioma de i18n
  const formattedDate = format(new Date(toolsMovement.createdAt), "dd 'de' MMMM 'de' yyyy, hh:mm a", { locale: es });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="mt-1 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{t("tools.movementViewPage.header.title")}</h1>
            <Badge 
              variant="outline"
              className={`font-bold px-3 py-1 uppercase tracking-wider text-xs gap-1.5 shadow-sm
                ${isInput 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" 
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                }`}
            >
              {isInput ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {isInput ? t("tools.movementViewPage.badge.in") : t("tools.movementViewPage.badge.out")}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
            <Calendar className="h-3.5 w-3.5" />
            {t("tools.movementViewPage.header.registeredAt")} {formattedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <ToolPreviewCard tool={tool} />

        {/* === Detalles del Movimiento === */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {isInput ? t("tools.movementViewPage.card.titleIn") : t("tools.movementViewPage.card.titleOut")}
              </CardTitle>
              <CardDescription>
                {t("tools.movementViewPage.card.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              
              {/* Si es Salida */}
              {!isInput && toolsMovement.movementOut && (
                <ItAssetMovementOutDetails toolMovement={toolsMovement}/>
              )}

              {/* Si es Entrada */}
              {isInput && toolsMovement.movementIn && (
                <ItAssetMovementInDetails toolMovement={toolsMovement} />
              )}

              {((isInput && !toolsMovement.movementIn) || (!isInput && !toolsMovement.movementOut)) && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Info className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">{t("tools.movementViewPage.card.noDetails")}</p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ToolsMovementViewPage;