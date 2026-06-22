import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useItAssets } from "../hooks/useItAssets";
import useItAssetsStatus from "../hooks/useItAssetsStatus";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { ItAssetsForm } from "../components/ItAssetsFormPage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const ItAssetsCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createAssetMutation, isCreatingAsset } = useItAssets();
  const { itAssetsStatus, isLoading: isLoadingStatus } = useItAssetsStatus();

  // Metemos el esquema dentro del componente, pero lo memorizamos 
  // para que solo se vuelva a crear si el idioma cambia.
  const createAssetSchema = useMemo(() => z.object({
    serialNumber: z.string().min(1, t("itAssets.createPage.validation.serialNumber")).trim(),
    idInventary: z.string().trim().optional(),
    typeId: z.string().min(1, t("itAssets.createPage.validation.typeId")),
    brandId: z.string().min(1, t("itAssets.createPage.validation.brandId")),
    modelId: z.string().min(1, t("itAssets.createPage.validation.modelId")),
    statusId: z.string().min(1, t("itAssets.createPage.validation.statusId")),
    invoiceId: z.string().optional(),
    description: z.string().trim().optional(),
    observations: z.string().trim().optional(),
    imageFile: z.any().refine((file) => file instanceof File, t("itAssets.createPage.validation.imageFile")),
  }), [t]);

  type CreateAssetFormValues = z.infer<typeof createAssetSchema>;

  const form = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      serialNumber: "",
      idInventary: "",
      typeId: "",
      brandId: "", 
      modelId: "",
      statusId: "",
      invoiceId: "",
      description: "",
      observations: "",
      imageFile: undefined,
    },
  });

  const onSubmit = async (data: CreateAssetFormValues) => {
    const formData = new FormData();
    formData.append("serialNumber", data.serialNumber);
    formData.append("modelId", data.modelId);
    formData.append("statusId", data.statusId);
    formData.append("typeId", data.typeId);
    
    if (data.imageFile) formData.append("file", data.imageFile); 
    if (data.idInventary) formData.append("idInventary", data.idInventary);
    if (data.invoiceId) formData.append("invoiceId", data.invoiceId);
    if (data.description) formData.append("description", data.description);
    if (data.observations) formData.append("observations", data.observations);

    try {
      await sileo.promise(
        createAssetMutation.mutateAsync(formData),
        {
          loading: { title: t("itAssets.createPage.sileo.loading.title") },
          success: { 
            title: t("itAssets.createPage.sileo.success.title"), 
            description: t("itAssets.createPage.sileo.success.description"), 
            duration: 4000 
          },
          error: (err) => {
            let backendMessage = t("itAssets.createPage.sileo.error.defaultMessage");
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: t("itAssets.createPage.sileo.error.title"), description: backendMessage, duration: 5000 };
          },
        }
      );
      navigate("/it-assets");
    } catch (error) {
      logError(error, "ItAssetsCreatePage");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      <CustomTitlePageWithBack backLink="/it-assets" 
        title={t("itAssets.createPage.header.title")} 
        description={t("itAssets.createPage.header.description")} 
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("itAssets.createPage.card.title")}</CardTitle>
          <CardDescription>
            {t("itAssets.createPage.card.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <ItAssetsForm 
                isSaving={isCreatingAsset}
                itAssetsStatus={itAssetsStatus}
                isLoadingStatus={isLoadingStatus}
                showObservations={true} 
                itAssetInitialData={null}
              />

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingAsset}>
                  {t("itAssets.createPage.buttons.cancel")}
                </Button>
                <Button type="submit" disabled={isCreatingAsset}>
                  {isCreatingAsset ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("itAssets.createPage.buttons.submitting")}</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> {t("itAssets.createPage.buttons.submit")}</>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItAssetsCreatePage;