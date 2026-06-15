import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { 
  Loader2, 
  ArrowLeft, 
  ImageIcon, 
  CheckCircle2, 
  XCircle,
  Barcode, 
  Hash, 
  Monitor, 
  Building2, 
  Tag, 
  Activity, 
  FileText, 
  Calendar, 
  Clock, 
  AlignLeft
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hooks
import { useItAssets } from "../hooks/useItAssets";
import DetailItem from "@/components/custom/DetailItem";

const ItAssetsDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // El hook ya saca el ID de la URL internamente
  const { itAsset, isLoadingAsset } = useItAssets();

  // Función auxiliar para formatear fechas
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoadingAsset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("itAssets.detailsPage.loading", "Cargando detalles del activo...")}</p>
      </div>
    );
  }

  if (!itAsset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">{t("itAssets.detailsPage.notFound", "Activo no encontrado")}</h2>
        <Button variant="outline" onClick={() => navigate("/it-assets")}>
          {t("itAssets.detailsPage.backToList", "Volver a la lista")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("itAssets.detailsPage.header.title", "Detalles del Activo")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("itAssets.detailsPage.header.description", "Información completa del activo de TI.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA PRINCIPAL (Detalles) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.info.title", "Información General")}</CardTitle>
              <CardDescription>
                {t("itAssets.detailsPage.card.info.description", "Datos de identificación y estado.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Uso del nuevo DetailItem */}
              <DetailItem icon={Barcode} label={t("itAssets.fields.serialNumber", "Número de Serie")} value={itAsset.serialNumber || "N/A"} />
              <DetailItem icon={Hash} label={t("itAssets.fields.idInventary", "ID Inventario")} value={itAsset.idInventary || "N/A"} />
              <DetailItem icon={Monitor} label={t("itAssets.fields.type", "Tipo")} value={itAsset.itAssetsType?.name || "N/A"} />
              <DetailItem icon={Building2} label={t("itAssets.fields.brand", "Marca")} value={itAsset.model?.brand?.name || "N/A"} />
              <DetailItem icon={Tag} label={t("itAssets.fields.model", "Modelo")} value={itAsset.model?.name || "N/A"} />
              <DetailItem icon={Activity} label={t("itAssets.fields.status", "Estado Físico")} value={itAsset.itAssetStatus?.name || "N/A"} />
              
              {/* Bloques personalizados para los booleanos */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <Activity className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("itAssets.fields.isActive", "Activo")}
                  </span>
                </div>
                <div className="pl-1 mt-1">
                  <Badge variant={itAsset.status ? "default" : "destructive"}>
                    {itAsset.status ? t("common.yes", "Sí") : t("common.no", "No")}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("itAssets.fields.inUse", "En Uso")}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-1 mt-1">
                  {itAsset.inUse ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold">{itAsset.inUse ? t("common.inUse", "Asignado") : t("common.available", "Disponible")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.additional.title", "Datos Adicionales")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <DetailItem icon={FileText} label={t("itAssets.fields.invoice", "Factura")} value={itAsset.invoice?.idInternal || "N/A"} />
              <div className="hidden sm:block"></div> {/* Espaciador invisible para mantener el grid alineado */}
              
              <DetailItem icon={Calendar} label={t("itAssets.fields.createdAt", "Fecha de Creación")} value={formatDate(itAsset.createdAt)} />
              <DetailItem icon={Clock} label={t("itAssets.fields.updatedAt", "Última Actualización")} value={formatDate(itAsset.updatedAt)} />
              
              <DetailItem 
                icon={AlignLeft} 
                label={t("itAssets.fields.description", "Descripción")} 
                value={itAsset.description || t("common.noDescription", "Sin descripción detallada.")} 
                isTextarea={true} 
              />

            </CardContent>
          </Card>
        </div>

        {/* COLUMNA SECUNDARIA (Imagen) */}
        <div className="md:col-span-1">
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.image.title", "Fotografía")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {itAsset.imageUrl ? (
                <div className="relative w-full aspect-square overflow-hidden rounded-md border shadow-sm">
                  <img 
                    src={itAsset.imageUrl} 
                    alt={itAsset.serialNumber} 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full aspect-square bg-muted/30 rounded-md border border-dashed gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10 opacity-50" />
                  <span className="text-sm">{t("itAssets.detailsPage.noImage", "Sin imagen disponible")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ItAssetsDetailsPage;