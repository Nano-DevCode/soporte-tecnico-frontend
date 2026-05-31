import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Loader2, ArrowLeft, Monitor, RefreshCw, Info } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// Hooks
import { useItAssets } from "../hooks/useItAssets";
import useItAssetsStatus from "../hooks/useItAssetsStatus";
import { useItAssetsMovements } from "../hooks/useItAssetsMovements";
import type { BackendError } from "@/interfaces/backendError.interfaces";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Custom Components
import CustomItAssetPreview from "../components/CustomItAssetPreview";
import { CustomConfirmChangeStatusItAsset } from "../components/CustomConfirmChangeStatusItAsset";

// ==========================================
// ESQUEMA DE VALIDACIÓN ZOD (Entrada)
// ==========================================
const movementInSchema = z.object({
  itAssetsStatusId: z.string().min(1, "Debes seleccionar un estado"),
  observations: z.string().optional(),
});

type MovementInFormValues = z.infer<typeof movementInSchema>;

const ItAssetsMovementIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados locales para la gestión del estado del activo
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Hooks de datos
  const { itAsset, isLoadingAsset } = useItAssets();
  const { itAssetsStatus, isLoading: isLoadingStatus } = useItAssetsStatus();
  const { createInMovementAsync, isCreatingIn } = useItAssetsMovements();

  // Configuración de React Hook Form
  const form = useForm<MovementInFormValues>({
    resolver: zodResolver(movementInSchema),
    defaultValues: {
      itAssetsStatusId: "",
      observations: "",
    },
  });

  // Observador para mostrar la descripción del estado seleccionado
  const currentStatusId = form.watch("itAssetsStatusId");
  const selectedStatusDetail = itAssetsStatus.find(status => status.id === currentStatusId);

  // Pre-cargar el estado actual del equipo al abrir el formulario
  useEffect(() => {
    if (itAsset?.itAssetStatus?.id) {
      form.setValue("itAssetsStatusId", itAsset.itAssetStatus.id);
    }
  }, [itAsset, form]);

  // Manejador del Submit
  const onSubmit = async (data: MovementInFormValues) => {
    if (!id) return;

    // Objeto de envío limpio (aplicando short-circuit para opcionales)
    const payload = {
      itAssetId: id,
      itAssetsStatusId: data.itAssetsStatusId,
      ...(data.observations && { observations: data.observations })
    };

    try {
      await sileo.promise(
        createInMovementAsync(payload),
        {
          loading: { title: "Registrando entrada..." },
          success: {
            title: "Entrada registrada",
            description: "El activo se ha ingresado correctamente al inventario.",
            duration: 4000,
          },
          error: (err) => {
            let backendMessage = "Error en el servidor al intentar registrar la entrada.";

            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }

            return {
              title: "Error al registrar entrada",
              description: backendMessage,
              duration: 5000,
            };
          },
        }
      );
      navigate("/it-assets"); // Ajusta esta ruta a donde quieres redirigir
    } catch (error) {
      console.error(error);
    }
  };

  // Estados de carga y error (UI)
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
        <Button className="mt-4" onClick={() => navigate("/it-assets")}>Volver al catálogo</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* CABECERA */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Entrada</h1>
          <p className="text-muted-foreground text-sm">Recibe este equipo y actualiza su condición física.</p>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: PREVIEW */}
        <div className="w-full md:col-span-5 lg:col-span-4">
          <CustomItAssetPreview itAsset={itAsset} mode="in"/>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="w-full md:col-span-7 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Recepción</CardTitle>
              <CardDescription>
                Verifica en qué condiciones regresa el activo y anota cualquier detalle importante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* CAMPO: ESTADO DEL ACTIVO */}
                  <FormField
                    control={form.control}
                    name="itAssetsStatusId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado físico al momento de entrar <span className="text-red-500">*</span></FormLabel>
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
                              disabled={isCreatingIn}
                            >
                              <RefreshCw className="h-3 w-3 mr-2" /> Cambiar Estado
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isCreatingIn}>
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

                  {/* CAMPO: OBSERVACIONES */}
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ej. El equipo regresó con polvo, pantalla sucia, cable doblado..." 
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
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreatingIn}>
                      {isCreatingIn ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</>
                      ) : (
                        <><LogIn className="mr-2 h-4 w-4" /> Registrar Entrada</>
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

export default ItAssetsMovementIn;