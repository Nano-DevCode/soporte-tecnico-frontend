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
  AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTools } from "../hooks/useTools";
import DetailItem from "@/components/custom/DetailItem";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const ToolsDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { tool, isLoading } = useTools();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("tools.detailsPage.loading")}</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">{t("tools.detailsPage.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/tools")}>
          {t("tools.detailsPage.backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      <CustomTitlePageWithBack 
        backLink="/tools" 
        title={t("tools.detailsPage.header.title")} 
        description={t("tools.detailsPage.header.description")} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Detalles */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.detailsPage.card.info.title")}</CardTitle>
              <CardDescription>
                {t("tools.detailsPage.card.info.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <DetailItem icon={Barcode} label={t("tools.detailsPage.fields.serialNumber")} value={tool.serialNumber || "N/A"} />
              <DetailItem icon={Hash} label={t("tools.detailsPage.fields.idInventary")} value={tool.idInventary || "N/A"} />
              <DetailItem icon={Monitor} label={t("tools.detailsPage.fields.type")} value={tool.toolType?.name || "N/A"} />
              <DetailItem icon={Building2} label={t("tools.detailsPage.fields.brand")} value={tool.model?.brand?.name || "N/A"} />
              <DetailItem icon={Tag} label={t("tools.detailsPage.fields.model")} value={tool.model?.name || "N/A"} />
              <DetailItem icon={Activity} label={t("tools.detailsPage.fields.status")} value={tool.toolStatus?.name || "N/A"} />
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <Activity className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("tools.detailsPage.fields.isActive")}
                  </span>
                </div>
                <div className="pl-1 mt-1">
                  <Badge variant={tool.status ? "default" : "destructive"}>
                    {tool.status ? t("tools.detailsPage.common.yes") : t("tools.detailsPage.common.no")}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center bg-muted/60 p-1.5 rounded-md border border-border/40 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("tools.detailsPage.fields.inUse")}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-1 mt-1">
                  {tool.inUse ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold">{tool.inUse ? t("tools.detailsPage.common.assigned") : t("tools.detailsPage.common.available")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("tools.detailsPage.card.additional.title")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <DetailItem icon={FileText} label={t("tools.detailsPage.fields.invoice")} value={tool.invoice?.idInternal || "N/A"} />
              <div className="hidden sm:block"></div> 
              
              <DetailItem icon={Calendar} label={t("tools.detailsPage.fields.createdAt")} value={formatDate(tool.createdAt)} />
              <DetailItem icon={Clock} label={t("tools.detailsPage.fields.updatedAt")} value={formatDate(tool.updatedAt)} />
              
              <DetailItem 
                icon={AlignLeft} 
                label={t("tools.detailsPage.fields.description")} 
                value={tool.description || t("tools.detailsPage.common.noDescription")} 
                isTextarea={true} 
              />

            </CardContent>
          </Card>
        </div>

        {/* Imagen */}
        <div className="md:col-span-1">
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle>{t("tools.detailsPage.card.image.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {tool.imageUrl ? (
                <div className="relative w-full aspect-square overflow-hidden rounded-md border shadow-sm">
                  <img 
                    src={tool.imageUrl} 
                    alt={tool.serialNumber} 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full aspect-square bg-muted/30 rounded-md border border-dashed gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10 opacity-50" />
                  <span className="text-sm">{t("tools.detailsPage.noImage")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ToolsDetailsPage;