import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";

// UI Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Wrappers Custom
import { TypeSelectField } from "./TypeSelectField";
import { BrandSelectField } from "./BrandSelectField";
import { ModelSelectField } from "./ModelSelectField";
import { InvoiceSelectField } from "./InvoiceSelectField";
import { ImageUploadField } from "./ImageUploadField";

// Tipados (Asegúrate de que las rutas relativas a tu carpeta de interfaces sean correctas)
import type { ItAssetsStatus } from "../interfaces/itAssetsStatusResponse.interface";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface ItAssetsFormProps {
  isSaving: boolean;
  showObservations?: boolean;
  itAssetsStatus: ItAssetsStatus[]; // Tipado con tu interfaz
  isLoadingStatus: boolean;
  itAssetInitialData?: ItAsset | null; // Tipado con tu interfaz
}

export const ItAssetsForm = ({
  isSaving,
  showObservations = true,
  itAssetsStatus,
  isLoadingStatus,
  itAssetInitialData
}: ItAssetsFormProps) => {
  const form = useFormContext();

  // Escuchamos el estado seleccionado para mostrar su descripción
  const currentStatusId = form.watch("statusId");
  const selectedStatusDetail = itAssetsStatus.find(status => status.id === currentStatusId);

  return (
    <div className="space-y-6">
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
                <Input placeholder="Ej. PF3ZQ..." {...field} disabled={isSaving} />
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
                <Input placeholder="Ej. ITO-PC-001" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SELECTORES INFINITOS (Usando el tipado de itAssetInitialData) */}
        <TypeSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.itAssetsType ? { id: itAssetInitialData.itAssetsType.id, name: itAssetInitialData.itAssetsType.name } : null} 
        />
        
        <BrandSelectField 
          disabled={isSaving} 
          // (Asumiendo que dentro de Model existe la propiedad Brand con id y name)
          initialData={itAssetInitialData?.model?.brand ? { id: itAssetInitialData.model.brand.id, name: itAssetInitialData.model.brand.name } : null} 
        />
        
        <ModelSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.model ? { id: itAssetInitialData.model.id, name: itAssetInitialData.model.name } : null} 
        />
        
        <InvoiceSelectField 
          disabled={isSaving} 
          // Forzamos el tipado a any en idInternal si Invoice no lo exporta explícitamente en su interfaz base
          initialData={itAssetInitialData?.invoice ? { id: itAssetInitialData.invoice.id, name: itAssetInitialData.invoice.idInternal || "Factura" } : null} 
        />

        {/* ESTADO DEL ACTIVO */}
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{!showObservations ? "Estado Físico" : "Estado Físico Inicial"} <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isSaving}>
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

      {/* FIELD DE LA FOTOGRAFÍA */}
      <ImageUploadField 
        disabled={isSaving} 
        currentImageUrl={itAssetInitialData?.imageUrl || null} 
      />

      {/* DESCRIPCIÓN */}
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
                disabled={isSaving} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* OBSERVACIONES CONDICIONALES (Solo Creación) */}
      {showObservations && (
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones Iniciales (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalles sobre desperfectos de fábrica, faltantes en entrega..." 
                  className="resize-none" 
                  {...field} 
                  disabled={isSaving} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};