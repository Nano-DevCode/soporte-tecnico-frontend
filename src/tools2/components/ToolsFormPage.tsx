import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

// UI Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypeSelectField } from "./TypeSelectField";
import { BrandSelectField } from "./BrandSelectField";
import { ModelSelectField } from "./ModelSelectField";
import { InvoiceSelectField } from "./InvoiceSelectField";
import { ImageUploadField } from "./ImageUploadField";
import type { ToolsStatus } from "../interfaces/toolsStatusResponse.interface";
import type { Tool } from "../interfaces/toolsResponse.interface";
import { CustomCombobox } from "@/components/custom/CustomCombobox";
import { Info } from "lucide-react";

interface ToolsFormProps {
  isSaving: boolean;
  showObservations?: boolean;
  toolsStatus: ToolsStatus[];
  isLoadingStatus: boolean;
  toolInitialData?: Tool | null;
}

export const ToolsForm = ({
  isSaving,
  showObservations = true,
  toolsStatus,
  isLoadingStatus,
  toolInitialData
}: ToolsFormProps) => {
  const { t } = useTranslation();
  const form = useFormContext();

  // Escuchamos el estado seleccionado para mostrar su descripción
  const currentStatusId = form.watch("statusId");
  const selectedStatusDetail = toolsStatus.find(status => status.id === currentStatusId);

  return (
    <div className="space-y-6">
      {/* === GRID DE 2 COLUMNAS PARA CAMPOS CORTOS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* ID INVENTARIO */}
        <FormField
          control={form.control}
          name="idInventary"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("tools.components.form.idInventory.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("tools.components.form.idInventory.placeholder")} {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NOMBRE DE LA HERRAMIENTA (OPCIONAL) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("tools.components.form.name.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("tools.components.form.name.placeholder")} value={field.value || ''} onChange={field.onChange} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SELECTORES INFINITOS (Usando el tipado de toolInitialData) */}
        <TypeSelectField 
          disabled={isSaving} 
          initialData={toolInitialData?.toolType ? { id: toolInitialData.toolType.id, name: toolInitialData.toolType.name } : null}
        />
        
        <BrandSelectField 
          disabled={isSaving} 
          // (Asumiendo que dentro de Model existe la propiedad Brand con id y name)
          initialData={toolInitialData?.model?.brand ? { id: toolInitialData.model.brand.id, name: toolInitialData.model.brand.name } : null} 
        />
        
        <ModelSelectField 
          disabled={isSaving} 
          initialData={toolInitialData?.model ? { id: toolInitialData.model.id, name: toolInitialData.model.name } : null} 
        />
        
        <InvoiceSelectField 
          disabled={isSaving} 
          // Forzamos el tipado a any en idInternal si Invoice no lo exporta explícitamente en su interfaz base
          initialData={toolInitialData?.invoice ? { id: toolInitialData.invoice.id, name: toolInitialData.invoice.idInternal || "Factura" } : null} 
        />

        {/* ESTADO DEL ACTIVO - COMPONENTE REUTILIZABLE */}
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {!showObservations 
                  ? t("tools.components.form.status.labelEdit") 
                  : t("tools.components.form.status.labelCreate")} <span className="text-red-500">*</span>
              </FormLabel>
              
              <FormControl>
                <CustomCombobox
                  // Mapeamos los datos de la API (id, name) al estándar del componente (value, label)
                  options={toolsStatus.map((status) => ({
                    value: String(status.id),
                    label: status.name,
                  }))}
                  
                  // Pasamos las propiedades de react-hook-form
                  value={field.value ? String(field.value) : undefined}
                  onChange={(val) => {
                    field.onChange(val); // Actualiza el estado del form
                  }}
                  
                  // Configuración extra
                  disabled={isLoadingStatus || isSaving}
                  placeholder={t("tools.components.form.status.placeholder")}
                  emptyText="No se encontraron estados."
                />
              </FormControl>
              
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
            <strong className="text-foreground/80 block mb-0.5">{t("tools.components.form.status.descriptionTitle")}</strong>
            {selectedStatusDetail.description}
          </p>
        </div>
      )}

      {/* FIELD DE LA FOTOGRAFÍA */}
      <ImageUploadField 
        disabled={isSaving} 
        currentImageUrl={toolInitialData?.imageUrl || null} 
      />

      {/* DESCRIPCIÓN */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("tools.components.form.description.label")}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t("tools.components.form.description.placeholder")} 
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
              <FormLabel>{t("tools.components.form.observations.label")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("tools.components.form.observations.placeholder")} 
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

export default ToolsForm;