import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogOut, Loader2, Monitor } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

// Componentes y Hooks Generales
import { cn } from "@/lib/utils";
import { useTools } from "../hooks/useTools";
import { useToolsMovements } from "../hooks/useToolsMovements";
import type { BackendError } from "@/interfaces/backendError.interfaces";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Componentes Custom
import CustomItAssetPreview from "../components/CustomToolPreview";
import { StaffOutSection } from "../components/StaffOutSection";
import { TicketOutSection } from "../components/TicketOutSection";
import { ToolStatusSelect } from "../components/ToolStatusSelectUpd"; // <-- NUEVO COMPONENTE
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

type MovementMode = "sin_ticket" | "con_ticket";

const ToolsMovementOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [movementMode, setMovementMode] = useState<MovementMode>("sin_ticket");

  const { tool, isLoading } = useTools();
  const { createOutMovementAsync, isCreatingOut } = useToolsMovements();

  // Esquema de validación memorizado para usar traducciones
  const movementOutSchema = useMemo(() => z.object({
    movementMode: z.enum(["sin_ticket", "con_ticket"]),
    toolStatusId: z.string().min(1, t("tools.movementOut.validation.statusRequired")),
    staffId: z.string().optional(),
    tikedId: z.string().optional(),
    observations: z.string().trim().optional(), 
    description: z.string().trim().optional(), 
    voucher: z.string().trim().optional(),
  }).superRefine((values, ctx) => {
    if (values.movementMode === "sin_ticket") {
      if (!values.staffId) {
        ctx.addIssue({ code: "custom", message: t("tools.movementOut.validation.staffRequired"), path: ["staffId"] });
      }
      const desc = values.description || ""; 
      if (desc.length < 10) { 
        ctx.addIssue({ code: "custom", message: t("tools.movementOut.validation.descriptionLength"), path: ["description"] });
      }
    }
    if (values.movementMode === "con_ticket" && !values.tikedId) {
      ctx.addIssue({ code: "custom", message: t("tools.movementOut.validation.ticketRequired"), path: ["tikedId"] });
    }
  }), [t]);

  type MovementOutFormValues = z.infer<typeof movementOutSchema>;

  const form = useForm<MovementOutFormValues>({
    resolver: zodResolver(movementOutSchema),
    defaultValues: {
      movementMode: "sin_ticket",
      toolStatusId: "",
      staffId: "",
      tikedId: "",
      observations: "",
      description: "",
      voucher: "",
    },
  });

  // Limpiar campos visualmente y borrar errores cuando cambia el modo
  useEffect(() => {
    form.setValue("movementMode", movementMode);
    if (movementMode === "sin_ticket") {
      form.setValue("tikedId", ""); 
      form.clearErrors("tikedId"); 
    } else {
      form.setValue("staffId", ""); 
      form.setValue("description", "");
      form.clearErrors(["staffId", "description"]); 
    }
  }, [movementMode, form]);

  // Cargar estado inicial del equipo
  useEffect(() => {
    if (tool?.toolStatus?.id) {
      form.setValue("toolStatusId", tool.toolStatus.id);
    }
  }, [tool, form]);

  const onSubmit = async (data: MovementOutFormValues) => {
    if (!id) return;

    const finalPayload = {
      toolId: id,
      toolStatusId: data.toolStatusId,
      observations: data.observations || undefined,
      voucher: data.voucher || undefined,
      staffId: movementMode === "sin_ticket" && data.staffId ? data.staffId : undefined,
      description: movementMode === "sin_ticket" && data.description ? data.description : undefined,
      ticketId: movementMode === "con_ticket" && data.tikedId ? data.tikedId : undefined,
    };

    try {
      await sileo.promise(
        createOutMovementAsync(finalPayload),
        {
          loading: { title: t("tools.movementOut.sileo.loading.title") },
          success: { 
            title: t("tools.movementOut.sileo.success.title"), 
            description: t("tools.movementOut.sileo.success.description"), 
            duration: 4000 
          },
          error: (err) => {
            let backendMessage = t("tools.movementOut.sileo.error.defaultMessage");
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: t("tools.movementOut.sileo.error.title"), description: backendMessage, duration: 5000 };
          },
        });
      navigate("/tools");
    } catch (error) {
      logError(error, "ToolsMovementOut");
    }
  };

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
        <h2 className="text-xl font-bold">{t("tools.movementOut.notFound.title")}</h2>
        <Button className="mt-4" onClick={() => navigate("/tools")}>
          {t("tools.movementOut.notFound.button")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      <CustomTitlePageWithBack
        backLink="/tools"
        title={t("tools.movementOut.header.title")}
        description={t("tools.movementOut.header.description")}
      />

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
        
        <div className="w-full md:col-span-5 lg:col-span-4">
          <CustomItAssetPreview tool={tool} mode="out"/>
        </div>

        <div className="w-full md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.movementOut.card.title")}</CardTitle>
              <CardDescription>{t("tools.movementOut.card.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* SELECTOR DE MODO (TABS) */}
                  <div className="flex p-1 bg-muted rounded-lg border border-border/50">
                    <button
                      type="button"
                      onClick={() => setMovementMode("sin_ticket")}
                      className={cn(
                        "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                        movementMode === "sin_ticket" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("tools.movementOut.tabs.staff")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementMode("con_ticket")}
                      className={cn(
                        "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                        movementMode === "con_ticket" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("tools.movementOut.tabs.ticket")}
                    </button>
                  </div>

                  {/* NUEVO COMPONENTE EXTRAÍDO */}
                  <ToolStatusSelect 
                    tool={tool} 
                    isDisabled={isCreatingOut} 
                  />

                  {/* SECCIONES DINÁMICAS */}
                  {movementMode === "sin_ticket" ? (
                    <StaffOutSection isDisabled={isCreatingOut} />
                  ) : (
                    <TicketOutSection isDisabled={isCreatingOut} />
                  )}

                  {/* CAMPOS COMUNES */}
                  <FormField
                    control={form.control}
                    name="voucher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tools.movementOut.form.voucherLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("tools.movementOut.form.voucherPlaceholder")} {...field} disabled={isCreatingOut} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tools.movementOut.form.observationsLabel")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("tools.movementOut.form.observationsPlaceholder")} className="resize-none h-24" {...field} disabled={isCreatingOut} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingOut}>
                      {t("tools.movementOut.buttons.cancel")}
                    </Button>
                    <Button type="submit" disabled={isCreatingOut}>
                      {isCreatingOut ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("tools.movementOut.buttons.submitting")}</>
                      ) : (
                        <><LogOut className="mr-2 h-4 w-4" /> {t("tools.movementOut.buttons.submit")}</>
                      )}
                    </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolsMovementOut;