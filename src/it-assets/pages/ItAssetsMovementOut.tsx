import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogOut, Loader2, ArrowLeft, Monitor, RefreshCw, Info } from "lucide-react";
import { sileo } from "sileo";

// Componentes y Hooks Generales
import { cn } from "@/lib/utils";
import { useItAssets } from "../hooks/useItAssets";
import useItAssetsStatus from "../hooks/useItAssetsStatus";
import { useItAssetsMovements } from "../hooks/useItAssetsMovements";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Componentes Custom
import CustomItAssetPreview from "../components/CustomItAssetPreview";
import { CustomConfirmChangeStatusItAsset } from "../components/CustomConfirmChangeStatusItAsset";
import { StaffOutSection } from "../components/StaffOutSection";
import { TicketOutSection } from "../components/TicketOutSection";
import { isAxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";

// ==========================================
// ESQUEMA DE VALIDACIÓN ZOD
// ==========================================
const movementOutSchema = z.object({
  itAssetsStatusId: z.string().min(1, "Debes seleccionar un estado"),
  staffId: z.string().optional(),
  tikedId: z.string().optional(),
  observations: z.string().optional(),
  description: z.string().optional(),
  voucher: z.string().optional(),
});

type MovementOutFormValues = z.infer<typeof movementOutSchema>;

type MovementMode = "sin_ticket" | "con_ticket";

const ItAssetsMovementOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados locales
  const [movementMode, setMovementMode] = useState<MovementMode>("sin_ticket");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Hooks de datos generales
  const { itAsset, isLoadingAsset } = useItAssets();
  const { itAssetsStatus, isLoading: isLoadingStatus } = useItAssetsStatus();
  const { createOutMovementAsync, isCreatingOut } = useItAssetsMovements();

  // Instancia de React-Hook-Form
  const form = useForm<MovementOutFormValues>({
    resolver: zodResolver(movementOutSchema),
    defaultValues: {
      itAssetsStatusId: "",
      staffId: "",
      tikedId: "",
      observations: "",
      description: "",
      voucher: "",
    },
  });

  // Limpiar campos específicos cuando cambia el modo de salida para no mandar datos mezclados
  useEffect(() => {
    if (movementMode === "sin_ticket") {
      form.setValue("tikedId", ""); 
    } else {
      form.setValue("staffId", ""); 
      form.setValue("description", "");
    }
  }, [movementMode, form]);

  // Observador de estado físico actual en el select
  const currentStatusId = form.watch("itAssetsStatusId");
  const selectedStatusDetail = itAssetsStatus.find(status => status.id === currentStatusId);

  // Cargar estado inicial del equipo
  useEffect(() => {
    if (itAsset?.itAssetStatus?.id) {
      form.setValue("itAssetsStatusId", itAsset.itAssetStatus.id);
    }
  }, [itAsset, form]);

  // Enviar formulario
  const onSubmit = async (data: MovementOutFormValues) => {
    if (!id) return;

    try {
      await sileo.promise(
        createOutMovementAsync({
          itAssetId: id,
          itAssetsStatusId: data.itAssetsStatusId,
          staffId: data.staffId ? data.staffId : undefined,
          ticketId: data.tikedId ? data.tikedId : undefined,
          observations: data.observations,
          description: data.description,
          voucher: data.voucher,
        }),
        {
          loading: { title: "Registrando salida..." },
          success: {
            title: "Salida registrada",
            description: "El activo se ha despachado exitosamente.",
            duration: 4000,
          },
          error: (err) => {
            let backendMessage = "Error en el servidor";

            if (
              isAxiosError<BackendError>(err) &&
              err.response?.data?.message
            ) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage)
                ? rawMessage[0]
                : rawMessage;
            }

            return {
              title: "Error al registrar salida",
              description: backendMessage,
              duration: 5000,
            };
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
      
      {/* HEADER DE LA PÁGINA */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('it-assets')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Salida</h1>
          <p className="text-muted-foreground text-sm">Asigna este equipo y actualiza su estado.</p>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
        
        {/* PREVIEW */}
        <div className="w-full md:col-span-5 lg:col-span-4">
          <CustomItAssetPreview itAsset={itAsset} />
        </div>

        {/* FORMULARIO PRINCIPAL */}
        <div className="w-full md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Salida</CardTitle>
              <CardDescription>Completa la información necesaria para registrar el movimiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* === SELECTOR DE MODO (TABS) === */}
                  <div className="flex p-1 bg-muted rounded-lg border border-border/50">
                    <button
                      type="button"
                      onClick={() => setMovementMode("sin_ticket")}
                      className={cn(
                        "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                        movementMode === "sin_ticket" 
                          ? "bg-background shadow-sm text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Salida a Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementMode("con_ticket")}
                      className={cn(
                        "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                        movementMode === "con_ticket" 
                          ? "bg-background shadow-sm text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Salida por Ticket
                    </button>
                  </div>

                  {/* ESTADO DEL ACTIVO (Común en ambos modos) */}
                  <FormField
                    control={form.control}
                    name="itAssetsStatusId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado físico al momento de salir <span className="text-red-500">*</span></FormLabel>
                        {!isEditingStatus ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/40 p-3 rounded-md border border-border/50">
                            <div className="flex-1">
                              <span className="block font-medium text-sm text-foreground">
                                {itAsset.itAssetStatus?.name || "Estado Desconocido"}
                              </span>
                              {itAsset.itAssetStatus?.description && (
                                <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2" title={itAsset.itAssetStatus.description}>
                                  {itAsset.itAssetStatus.description}
                                </span>
                              )}
                            </div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs shrink-0 self-start sm:self-auto"
                              onClick={() => setShowConfirmDialog(true)}
                              disabled={isCreatingOut}
                            >
                              <RefreshCw className="h-3 w-3 mr-2" /> Cambiar Estado
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isCreatingOut}>
                              <FormControl>
                                <SelectTrigger className="border-primary/50 focus:ring-primary/20">
                                  <SelectValue placeholder="Selecciona el estado físico del equipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {itAssetsStatus.map((status) => (
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
                                  <strong className="text-foreground/80 block mb-0.5">Descripción del estado:</strong>
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

                  {/* === SECCIONES DINÁMICAS (Se inyectan aquí) === */}
                  {movementMode === "sin_ticket" ? (
                    <StaffOutSection isDisabled={isCreatingOut} />
                  ) : (
                    <TicketOutSection isDisabled={isCreatingOut} />
                  )}

                  {/* VOUCHER (Común en ambos modos) */}
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

                  {/* OBSERVACIONES (Común en ambos modos) */}
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

      <CustomConfirmChangeStatusItAsset 
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog}
        currentStatusName={itAsset.itAssetStatus?.name}
        onConfirm={() => {
          setIsEditingStatus(true);
          setShowConfirmDialog(false);
        }}
      />

    </div>
  );
};

export default ItAssetsMovementOut;