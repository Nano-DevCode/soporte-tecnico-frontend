import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogOut, Loader2, ArrowLeft, Monitor } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// Componentes y Hooks Generales
import { cn } from "@/lib/utils";
import { useItAssets } from "../hooks/useItAssets";
import { useItAssetsMovements } from "../hooks/useItAssetsMovements";
import type { BackendError } from "@/interfaces/backendError.interfaces";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Componentes Custom
import CustomItAssetPreview from "../components/CustomItAssetPreview";
import { StaffOutSection } from "../components/StaffOutSection";
import { TicketOutSection } from "../components/TicketOutSection";
import { AssetStatusSelect } from "../components/AssetStatusSelect"; // <-- NUEVO COMPONENTE

// ==========================================
// ESQUEMA DE VALIDACIÓN ZOD
// ==========================================
const movementOutSchema = z.object({
  movementMode: z.enum(["sin_ticket", "con_ticket"]),
  itAssetsStatusId: z.string().min(1, "Debes seleccionar un estado"),
  staffId: z.string().optional(),
  tikedId: z.string().optional(),
  observations: z.string().trim().optional(), 
  description: z.string().trim().optional(), 
  voucher: z.string().trim().optional(),
}).superRefine((values, ctx) => {
  if (values.movementMode === "sin_ticket") {
    if (!values.staffId) {
      ctx.addIssue({ code: "custom", message: "Debes seleccionar un empleado para esta salida", path: ["staffId"] });
    }
    const desc = values.description || ""; 
    if (desc.length < 10) { 
      ctx.addIssue({ code: "custom", message: "La descripción es obligatoria y debe tener al menos 10 caracteres", path: ["description"] });
    }
  }
  if (values.movementMode === "con_ticket" && !values.tikedId) {
    ctx.addIssue({ code: "custom", message: "Debes vincular un ticket para esta salida", path: ["tikedId"] });
  }
});

type MovementOutFormValues = z.infer<typeof movementOutSchema>;
type MovementMode = "sin_ticket" | "con_ticket";

const ItAssetsMovementOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movementMode, setMovementMode] = useState<MovementMode>("sin_ticket");

  const { itAsset, isLoadingAsset } = useItAssets();
  const { createOutMovementAsync, isCreatingOut } = useItAssetsMovements();

  const form = useForm<MovementOutFormValues>({
    resolver: zodResolver(movementOutSchema),
    defaultValues: {
      movementMode: "sin_ticket",
      itAssetsStatusId: "",
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
    if (itAsset?.itAssetStatus?.id) {
      form.setValue("itAssetsStatusId", itAsset.itAssetStatus.id);
    }
  }, [itAsset, form]);

  const onSubmit = async (data: MovementOutFormValues) => {
    if (!id) return;

    const finalPayload = {
      itAssetId: id,
      itAssetsStatusId: data.itAssetsStatusId,
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
          loading: { title: "Registrando salida..." },
          success: { title: "Salida registrada", description: "El activo se ha despachado exitosamente.", duration: 4000 },
          error: (err) => {
            let backendMessage = "Error en el servidor";
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: "Error al registrar salida", description: backendMessage, duration: 5000 };
          },
        });
      navigate("/it-assets");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingAsset) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!itAsset) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Monitor className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-bold">Activo no encontrado</h2>
        <Button className="mt-4" onClick={() => navigate("/it-assets/catalog")}>Volver al catálogo</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/it-assets')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Salida</h1>
          <p className="text-muted-foreground text-sm">Asigna este equipo y actualiza su estado.</p>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
        
        <div className="w-full md:col-span-5 lg:col-span-4">
          <CustomItAssetPreview itAsset={itAsset} mode="out"/>
        </div>

        <div className="w-full md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Salida</CardTitle>
              <CardDescription>Completa la información necesaria para registrar el movimiento.</CardDescription>
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
                      Salida a Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementMode("con_ticket")}
                      className={cn(
                        "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                        movementMode === "con_ticket" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Salida por Ticket
                    </button>
                  </div>

                  {/* NUEVO COMPONENTE EXTRAÍDO */}
                  <AssetStatusSelect 
                    itAsset={itAsset} 
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
                        <FormLabel>Folio / Comprobante (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Vale-00123" {...field} disabled={isCreatingOut} />
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
                        <FormLabel>Observaciones físicas (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ej. Se entrega con rayón..." className="resize-none h-24" {...field} disabled={isCreatingOut} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingOut}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreatingOut}>
                      {isCreatingOut ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</>
                      ) : (
                        <><LogOut className="mr-2 h-4 w-4" /> Registrar Salida</>
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

export default ItAssetsMovementOut;