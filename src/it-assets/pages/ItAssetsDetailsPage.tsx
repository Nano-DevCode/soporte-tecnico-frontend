import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { 
  Loader2,  
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
  AlignLeft,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useItAssets } from "../hooks/useItAssets";
import DetailItem from "@/components/custom/DetailItem";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const ItAssetsDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { itAsset, isLoadingAsset } = useItAssets();

  if (isLoadingAsset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("itAssets.detailsPage.loading")}</p>
      </div>
    );
  }

  if (!itAsset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">{t("itAssets.detailsPage.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/it-assets")}>
          {t("itAssets.detailsPage.backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      <CustomTitlePageWithBack 
        backLink="/it-assets" 
        title={t("itAssets.detailsPage.header.title")} 
        description={t("itAssets.detailsPage.header.description")} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Detalles */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.info.title")}</CardTitle>
              <CardDescription>
                {t("itAssets.detailsPage.card.info.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <DetailItem icon={Barcode} label={t("itAssets.detailsPage.fields.serialNumber")} value={itAsset.serialNumber || "N/A"} />
              <DetailItem icon={Hash} label={t("itAssets.detailsPage.fields.idInventary")} value={itAsset.idInventary || "N/A"} />
              <DetailItem icon={Type} label={t("itAssets.detailsPage.fields.name")} value={itAsset.name || "N/A"} />
              <DetailItem icon={Monitor} label={t("itAssets.detailsPage.fields.type")} value={itAsset.itAssetsType?.name || "N/A"} />
              <DetailItem icon={Building2} label={t("itAssets.detailsPage.fields.brand")} value={itAsset.model?.brand?.name || "N/A"} />
              <DetailItem icon={Tag} label={t("itAssets.detailsPage.fields.model")} value={itAsset.model?.name || "N/A"} />
              <DetailItem icon={Activity} label={t("itAssets.detailsPage.fields.status")} value={itAsset.itAssetStatus?.name || "N/A"} />
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <Activity className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("itAssets.detailsPage.fields.isActive")}
                  </span>
                </div>
                <div className="pl-1 mt-1">
                  <Badge variant={itAsset.status ? "default" : "destructive"}>
                    {itAsset.status ? t("itAssets.detailsPage.common.yes") : t("itAssets.detailsPage.common.no")}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("itAssets.detailsPage.fields.inUse")}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-1 mt-1">
                  {itAsset.inUse ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold">{itAsset.inUse ? t("itAssets.detailsPage.common.assigned") : t("itAssets.detailsPage.common.available")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.additional.title")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <DetailItem icon={FileText} label={t("itAssets.detailsPage.fields.invoice")} value={itAsset.invoice?.idInternal || "N/A"} />
              <div className="hidden sm:block"></div> 
              
              <DetailItem icon={Calendar} label={t("itAssets.detailsPage.fields.createdAt")} value={formatDate(itAsset.createdAt)} />
              <DetailItem icon={Clock} label={t("itAssets.detailsPage.fields.updatedAt")} value={formatDate(itAsset.updatedAt)} />
              
              <DetailItem 
                icon={AlignLeft} 
                label={t("itAssets.detailsPage.fields.description")} 
                value={itAsset.description || t("itAssets.detailsPage.common.noDescription")} 
                isTextarea={true} 
              />

            </CardContent>
          </Card>
        </div>

        {/* Imagen */}
        <div className="md:col-span-1">
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle>{t("itAssets.detailsPage.card.image.title")}</CardTitle>
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
                  <span className="text-sm">{t("itAssets.detailsPage.noImage")}</span>
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