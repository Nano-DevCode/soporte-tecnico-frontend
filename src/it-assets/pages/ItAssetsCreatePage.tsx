import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Loader2, ArrowLeft, Info } from "lucide-react";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Hooks
import { useItAssets } from "../hooks/useItAssets";
import useItAssetsStatus from "../hooks/useItAssetsStatus";
import type { BackendError } from "@/interfaces/backendError.interfaces";

// Wrappers Custom
import { TypeSelectField } from "../components/TypeSelectField";
import { BrandSelectField } from "../components/BrandSelectField";
import { ModelSelectField } from "../components/ModelSelectField";
import { InvoiceSelectField } from "../components/InvoiceSelectField";
import { ImageUploadField } from "../components/ImageUploadField"; // <-- IMPORTACIÓN DE LA IMAGEN

// ==========================================
// ESQUEMA DE VALIDACIÓN ZOD
// ==========================================
const createAssetSchema = z.object({
  serialNumber: z.string().min(1, "El número de serie es obligatorio").trim(),
  idInventary: z.string().trim().optional(),
  typeId: z.string().min(1, "Debes seleccionar un tipo"),
  brandId: z.string().min(1, "Debes seleccionar una marca"),
  modelId: z.string().min(1, "Debes seleccionar un modelo"),
  statusId: z.string().min(1, "Debes seleccionar un estado inicial"),
  invoiceId: z.string().optional(),
  description: z.string().trim().optional(),
  observations: z.string().trim().optional(),
  // Validación para asegurarse de que seleccionen un archivo File
  imageFile: z.any().refine((file) => file instanceof File, "La fotografía del activo es obligatoria"),
});

type CreateAssetFormValues = z.infer<typeof createAssetSchema>;

const ItAssetsCreatePage = () => {
  const navigate = useNavigate();

  // Hooks de datos
  const { createAssetMutation, isCreatingAsset } = useItAssets();
  const { itAssetsStatus, isLoading: isLoadingStatus } = useItAssetsStatus();

  // Configuración del Formulario
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

  // Escuchamos el estado seleccionado para mostrar su descripción
  const currentStatusId = form.watch("statusId");
  const selectedStatusDetail = itAssetsStatus.find(status => status.id === currentStatusId);

  const onSubmit = async (data: CreateAssetFormValues) => {
    // CONSTRUCCIÓN DEL FormData (Obligatorio para enviar archivos al backend)
    const formData = new FormData();
    
    formData.append("serialNumber", data.serialNumber);
    formData.append("modelId", data.modelId);
    formData.append("statusId", data.statusId);
    formData.append("typeId", data.typeId);
    
    // Adjuntamos el archivo bajo la llave "file" que espera NestJS
    if (data.imageFile) {
      formData.append("file", data.imageFile); 
    }

    if (data.idInventary) formData.append("idInventary", data.idInventary);
    if (data.invoiceId) formData.append("invoiceId", data.invoiceId);
    if (data.description) formData.append("description", data.description);
    if (data.observations) formData.append("observations", data.observations);

    try {
      await sileo.promise(
        createAssetMutation.mutateAsync(formData), // Enviamos el FormData completo
        {
          loading: { title: "Registrando activo..." },
          success: { 
            title: "Activo registrado", 
            description: "El equipo ha sido añadido al inventario exitosamente.",
            duration: 4000 
          },
          error: (err) => {
            let backendMessage = "Error en el servidor al registrar el activo";
            if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
              const rawMessage = err.response.data.message;
              backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
            }
            return { title: "Error", description: backendMessage, duration: 5000 };
          },
        }
      );
      navigate("/it-assets");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo Activo TI</h1>
          <p className="text-muted-foreground text-sm">Registra un nuevo equipo en el inventario.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Equipo</CardTitle>
          <CardDescription>
            Llena los datos técnicos y administrativos del activo. Los campos con asterisco (*) son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* === GRID DE 2 COLUMNAS PARA CAMPOS CORTOS === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* NUMERO DE SERIE */}
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Número de Serie <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. PF3ZQ..." {...field} disabled={isCreatingAsset} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ID INVENTARIO */}
                <FormField
                  control={form.control}
                  name="idInventary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>ID Inventario Interno (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. ITO-PC-001" {...field} disabled={isCreatingAsset} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TIPO DE ACTIVO */}
                <TypeSelectField disabled={isCreatingAsset} />

                {/* MARCA */}
                <BrandSelectField disabled={isCreatingAsset} />

                {/* MODELO */}
                <ModelSelectField disabled={isCreatingAsset} />

                {/* FACTURA */}
                <InvoiceSelectField disabled={isCreatingAsset} />

                {/* ESTADO DEL ACTIVO */}
                <FormField
                  control={form.control}
                  name="statusId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Estado Físico Inicial <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isCreatingAsset}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un estado..." />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> 
              {/* === FIN DEL GRID === */}

              {/* PREVIEW DINÁMICO DE LA DESCRIPCIÓN DEL ESTADO */}
              {selectedStatusDetail?.description && (
                <div className="flex gap-2 items-start bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-md border border-blue-100 dark:border-blue-900/50 animate-in fade-in zoom-in-95 duration-200">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground/80 block mb-0.5">Descripción del estado seleccionado:</strong>
                    {selectedStatusDetail.description}
                  </p>
                </div>
              )}

              {/* FIELD DE LA FOTOGRAFÍA (Ubicado estratégicamente antes de los textareas) */}
              <ImageUploadField disabled={isCreatingAsset} />

              {/* CAMPOS LARGOS (TEXTAREAS) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Activo (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Características especiales, color, ubicación inicial..." 
                        className="resize-none" 
                        {...field} 
                        disabled={isCreatingAsset} 
                      />
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
                    <FormLabel>Observaciones (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles sobre su estado, faltantes..." 
                        className="resize-none" 
                        {...field} 
                        disabled={isCreatingAsset} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BOTONES DE ACCIÓN */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreatingAsset}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreatingAsset}>
                  {isCreatingAsset ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Registrar Activo</>
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