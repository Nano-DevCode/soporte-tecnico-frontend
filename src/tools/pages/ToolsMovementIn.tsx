import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Loader2, Monitor, RefreshCw, Info } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useTools } from "../hooks/useTools";
import { useToolsStatus } from "../hooks/useToolsStatus";
import { useToolsMovements } from "../hooks/useToolsMovements";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CustomItAssetPreview from "../components/CustomToolPreview";
import { CustomConfirmChangeStatusTool } from "../components/CustomConfirmChangeStatusTool";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const ToolsMovementIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Estados para la gestión del estado del activo
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { tool, isLoading } = useTools();
  const { toolStatus, isLoading: isLoadingStatus } = useToolsStatus();
  const { createInMovementAsync, isCreatingIn } = useToolsMovements();

  // Esquema de validación memorizado para que reaccione a cambios de idioma
  const movementInSchema = useMemo(() => z.object({
    toolStatusId: z.string().min(1, t("tools.movementIn.validation.statusRequired")),
    observations: z.string().optional(),
  }), [t]);

  type MovementInFormValues = z.infer<typeof movementInSchema>;

  // Configuración de React Hook Form
  const form = useForm<MovementInFormValues>({
    resolver: zodResolver(movementInSchema),
    defaultValues: {
      toolStatusId: "",
      observations: "",
    },
  });

  // Observador para mostrar la descripción del estado seleccionado
  const currentStatusId = useWatch({
    control: form.control,
    name: "toolStatusId",
  });
  const selectedStatusDetail = toolStatus.find(status => status.id === currentStatusId);

  // Pre-cargar el estado actual del equipo al abrir el formulario
  useEffect(() => {
    if (tool?.toolStatus?.id) {
      form.setValue("toolStatusId", tool.toolStatus.id);
    }
  }, [tool, form]);

  // Manejador del Submit
  const onSubmit = async (data: MovementInFormValues) => {
    if (!id) return;

    // Objeto de envío limpio (aplicando short-circuit para opcionales)
    const payload = {
      toolId: id,
      toolsStatusId: data.toolStatusId,
      ...(data.observations && { observations: data.observations })
    };

    try {
      await sileo.promise(
        createInMovementAsync(payload),
        {
          loading: { title: t("tools.movementIn.sileo.loading.title") },
          success: {
            title: t("tools.movementIn.sileo.success.title"),
            description: t("tools.movementIn.sileo.success.description"),
            duration: 4000,
          },
          error: (err) => {
            let backendMessage = t("tools.movementIn.sileo.error.defaultMessage");

            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }

            return {
              title: t("tools.movementIn.sileo.error.title"),
              description: backendMessage,
              duration: 5000,
            };
          },
        }
      );
      navigate("/tools"); // Ajusta esta ruta a donde quieres redirigir
    } catch (error) {
      logError(error, "ToolsMovementIn");
    }
  };

  // Estados de carga y error (UI)
  if (isLoading) {
    return (
      <div className="flex h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Monitor className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-bold">{t("tools.movementIn.notFound.title")}</h2>
        <Button className="mt-4" onClick={() => navigate("/tools")}>
          {t("tools.movementIn.notFound.button")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* CABECERA */}
      <CustomTitlePageWithBack
        backLink="/tools"
        title={t("tools.movementIn.header.title")}
        description={t("tools.movementIn.header.description")}
      />

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: PREVIEW */}
        <div className="w-full md:col-span-5 lg:col-span-4">
          <CustomItAssetPreview tool={tool} mode="in"/>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="w-full md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.movementIn.card.title")}</CardTitle>
              <CardDescription>
                {t("tools.movementIn.card.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* CAMPO: ESTADO DEL ACTIVO */}
                  <FormField
                    control={form.control}
                    name="toolStatusId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("tools.movementIn.form.statusLabel")} <span className="text-red-500">*</span>
                        </FormLabel>
                        {!isEditingStatus ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/40 p-3 rounded-md border border-border/50">
                            <div className="flex-1">
                              <span className="block font-medium text-sm text-foreground">
                                {tool.toolStatus?.name || t("tools.movementIn.form.unknownStatus")}
                              </span>
                              {tool.toolStatus?.description && (
                                <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2" title={tool.toolStatus.description}>
                                  {tool.toolStatus.description}
                                </span>
                              )}
                            </div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs shrink-0 self-start sm:self-auto"
                              onClick={() => setShowConfirmDialog(true)}
                              disabled={isCreatingIn}
                            >
                              <RefreshCw className="h-3 w-3 mr-2" /> {t("tools.movementIn.buttons.changeStatus")}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isCreatingIn}>
                              <FormControl>
                                <SelectTrigger className="border-primary/50 focus:ring-primary/20">
                                  <SelectValue placeholder={t("tools.movementIn.form.statusPlaceholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {toolStatus.map((status) => (
                                  <SelectItem key={status.id} value={status.id}>
                                    {status.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {selectedStatusDetail?.description && (
                              <div className="flex gap-2 items-start bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  <strong className="text-foreground/80 block mb-0.5">
                                    {t("tools.movementIn.form.statusDescriptionLabel")}
                                  </strong>
                                  {selectedStatusDetail.description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAMPO: OBSERVACIONES */}
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tools.movementIn.form.observationsLabel")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("tools.movementIn.form.observationsPlaceholder")} 
                            className="resize-none h-32" 
                            {...field} 
                            disabled={isCreatingIn} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* BOTONES */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingIn}>
                      {t("tools.movementIn.buttons.cancel")}
                    </Button>
                    <Button type="submit" disabled={isCreatingIn}>
                      {isCreatingIn ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("tools.movementIn.buttons.submitting")}</>
                      ) : (
                        <><LogIn className="mr-2 h-4 w-4" /> {t("tools.movementIn.buttons.submit")}</>
                      )}
                    </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <CustomConfirmChangeStatusTool
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog}
        currentStatusName={tool.toolStatus?.name}
        onConfirm={() => {
          setIsEditingStatus(true);
          setShowConfirmDialog(false);
        }}
      />

    </div>
  );
};

export default ToolsMovementIn;