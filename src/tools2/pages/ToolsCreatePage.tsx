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
import { useTools } from "../hooks/useTools";
import { useToolsStatus } from "../hooks/useToolsStatus";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { ToolsForm } from "../components/ToolsFormPage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const ToolsCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createMutation, isCreatingTool } = useTools();
  const { toolsStatus, isLoading: isLoadingStatus } = useToolsStatus();

  // Metemos el esquema dentro del componente, pero lo memorizamos 
  // para que solo se vuelva a crear si el idioma cambia.
  const createToolSchema = useMemo(() => z.object({
    idInventary: z.string().trim().optional(),
    name: z.string().trim().optional(), // <--- 1. AGREGADO EN EL ESQUEMA
    typeId: z.string().min(1, t("tools.createPage.validation.typeId")),
    brandId: z.string().min(1, t("tools.createPage.validation.brandId")),
    modelId: z.string().min(1, t("tools.createPage.validation.modelId")),
    statusId: z.string().min(1, t("tools.createPage.validation.statusId")),
    invoiceId: z.string().optional(),
    description: z.string().trim().optional(),
    observations: z.string().trim().optional(),
    imageFile: z.any().optional().refine((file) => !file || file instanceof File, t("tools.createPage.validation.imageFile")),
  }), [t]);

  type CreateToolFormValues = z.infer<typeof createToolSchema>;

  const form = useForm<CreateToolFormValues>({
    resolver: zodResolver(createToolSchema),
    defaultValues: {
      idInventary: "",
      name: "", // <--- 2. AGREGADO EN LOS VALORES POR DEFECTO
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

  const onSubmit = async (data: CreateToolFormValues) => {
    const formData = new FormData();
    formData.append("modelId", data.modelId);
    formData.append("statusId", data.statusId);
    formData.append("typeId", data.typeId);
    
    if (data.imageFile) formData.append("file", data.imageFile); 
    if (data.idInventary) formData.append("idInventary", data.idInventary);
    if (data.name) formData.append("name", data.name); // <--- 3. AGREGADO AL FORMDATA
    if (data.invoiceId) formData.append("invoiceId", data.invoiceId);
    if (data.description) formData.append("description", data.description);
    if (data.observations) formData.append("observations", data.observations);

    try {
      await sileo.promise(
        createMutation.mutateAsync(formData),
        {
          loading: { title: t("tools.createPage.sileo.loading.title") },
          success: { 
            title: t("tools.createPage.sileo.success.title"), 
            description: t("tools.createPage.sileo.success.description"), 
            duration: 4000 
          },
          error: (err) => {
            let backendMessage = t("tools.createPage.sileo.error.defaultMessage");
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: t("tools.createPage.sileo.error.title"), description: backendMessage, duration: 5000 };
          },
        }
      );
      navigate("/tools");
    } catch (error) {
      logError(error, "ToolsCreatePage");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      <CustomTitlePageWithBack backLink="/tools" 
        title={t("tools.createPage.header.title")} 
        description={t("tools.createPage.header.description")} 
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("tools.createPage.card.title")}</CardTitle>
          <CardDescription>
            {t("tools.createPage.card.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <ToolsForm 
                isSaving={isCreatingTool}
                toolsStatus={toolsStatus}
                isLoadingStatus={isLoadingStatus}
                showObservations={true} 
                toolInitialData={null}
              />

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingTool}>
                  {t("tools.createPage.buttons.cancel")}
                </Button>
                <Button type="submit" disabled={isCreatingTool}>
                  {isCreatingTool ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("tools.createPage.buttons.submitting")}</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> {t("tools.createPage.buttons.submit")}</>
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

export default ToolsCreatePage;