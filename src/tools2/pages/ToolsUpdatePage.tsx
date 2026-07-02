import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTools } from "../hooks/useTools";
import { useToolsStatus } from "../hooks/useToolsStatus";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { ToolsForm } from "../components/ToolsFormPage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const ToolsUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const { updateToolsMutation, tool, isLoading: isLoadingTool } = useTools();
  const { toolsStatus, isLoading: isLoadingStatus } = useToolsStatus();

  const updateToolSchema = useMemo(() => z.object({
    idInventary: z.string().trim().optional(),
    name: z.string().trim().optional(),
    typeId: z.string().min(1, t("tools.updatePage.validation.typeId")),
    brandId: z.string().min(1, t("tools.updatePage.validation.brandId")),
    modelId: z.string().min(1, t("tools.updatePage.validation.modelId")),
    statusId: z.string().min(1, t("tools.updatePage.validation.statusId")),
    invoiceId: z.string().optional(),
    description: z.string().trim().optional(),
    imageFile: z.any().optional(), 
  }), [t]);

  type UpdateToolFormValues = z.infer<typeof updateToolSchema>;

  const form = useForm<UpdateToolFormValues>({
    resolver: zodResolver(updateToolSchema),
    defaultValues: {
      idInventary: "",
      name: "",
      typeId: "",
      brandId: "", 
      modelId: "",
      statusId: "",
      invoiceId: "",
      description: "",
      imageFile: undefined,
    },
  });

  useEffect(() => {
    if (tool) {
      form.reset({
        idInventary: tool.idInventary || "",
        name: tool.name || "",
        typeId: tool.toolType?.id || "",
        brandId: tool.model?.brand?.id || "", 
        modelId: tool.model?.id || "",
        statusId: tool.toolStatus?.id || "",
        invoiceId: tool.invoice?.id || "",
        description: tool.description || "",
        imageFile: undefined, 
      });
    }
  }, [tool, form]);

  const isUpdating = updateToolsMutation.isPending;

  const onSubmit = async (data: UpdateToolFormValues) => {
    const formData = new FormData();
    formData.append("modelId", data.modelId);
    formData.append("statusId", data.statusId);
    formData.append("typeId", data.typeId);
    
    if (data.imageFile instanceof File) {
      formData.append("file", data.imageFile); 
    }

    if (data.idInventary) formData.append("idInventary", data.idInventary);
    if (data.name) formData.append("name", data.name);
    if (data.invoiceId) formData.append("invoiceId", data.invoiceId);
    if (data.description) formData.append("description", data.description);

    try {
      await sileo.promise(
        updateToolsMutation.mutateAsync({ id: id!, data: formData }),
        {
          loading: { title: t("tools.updatePage.sileo.loading.title") },
          success: { 
            title: t("tools.updatePage.sileo.success.title"), 
            description: t("tools.updatePage.sileo.success.description"), 
            duration: 4000 
          },
          error: (err) => {
            let backendMessage = t("tools.updatePage.sileo.error.defaultMessage");
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: t("tools.updatePage.sileo.error.title"), description: backendMessage, duration: 5000 };
          },
        }
      );
      navigate("/tools");
    } catch (error) {
      logError(error, "ToolsUpdatePage");
    }
  };

  if (isLoadingTool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("tools.updatePage.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <CustomTitlePageWithBack
        backLink="/tools"
        title={t("tools.updatePage.header.title")}
        description={t("tools.updatePage.header.description")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("tools.updatePage.card.title")}</CardTitle>
          <CardDescription>
            {t("tools.updatePage.card.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ToolsForm 
                isSaving={isUpdating}
                toolsStatus={toolsStatus}
                isLoadingStatus={isLoadingStatus}
                showObservations={false}
                toolInitialData={tool}
              />

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isUpdating}>
                  {t("tools.updatePage.buttons.cancel")}
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("tools.updatePage.buttons.submitting")}</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> {t("tools.updatePage.buttons.submit")}</>
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

export default ToolsUpdatePage;