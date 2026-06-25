import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

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

// Tipados
import type { ItAssetsStatus } from "../interfaces/itAssetsStatusResponse.interface";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

interface ItAssetsFormProps {
  isSaving: boolean;
  showObservations?: boolean;
  itAssetsStatus: ItAssetsStatus[];
  isLoadingStatus: boolean;
  itAssetInitialData?: ItAsset | null;
}

export const ItAssetsForm = ({
  isSaving,
  showObservations = true,
  itAssetsStatus,
  isLoadingStatus,
  itAssetInitialData
}: ItAssetsFormProps) => {
  const { t } = useTranslation();
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
              <FormLabel>{t("itAssets.components.form.serialNumber.label")} <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder={t("itAssets.components.form.serialNumber.placeholder")} {...field} disabled={isSaving} />
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
              <FormLabel>{t("itAssets.components.form.idInventory.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("itAssets.components.form.idInventory.placeholder")} {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SELECTORES INFINITOS */}
        <TypeSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.itAssetsType ? { id: itAssetInitialData.itAssetsType.id, name: itAssetInitialData.itAssetsType.name } : null} 
        />
        
        <BrandSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.model?.brand ? { id: itAssetInitialData.model.brand.id, name: itAssetInitialData.model.brand.name } : null} 
        />
        
        <ModelSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.model ? { id: itAssetInitialData.model.id, name: itAssetInitialData.model.name } : null} 
        />
        
        <InvoiceSelectField 
          disabled={isSaving} 
          initialData={itAssetInitialData?.invoice ? { id: itAssetInitialData.invoice.id, name: itAssetInitialData.invoice.idInternal || "Factura" } : null} 
        />

        {/* ESTADO DEL ACTIVO */}
        <FormField
          control={form.control}
          name="statusId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {!showObservations 
                  ? t("itAssets.components.form.status.labelEdit") 
                  : t("itAssets.components.form.status.labelCreate")} <span className="text-red-500">*</span>
              </FormLabel>
              <Select 
                // IDÉNTICO A TOOLS:
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={isLoadingStatus || isSaving}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("itAssets.components.form.status.placeholder")} />
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
            <strong className="text-foreground/80 block mb-0.5">{t("itAssets.components.form.status.descriptionTitle")}</strong>
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
            <FormLabel>{t("itAssets.components.form.description.label")}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t("itAssets.components.form.description.placeholder")} 
                className="resize-none" 
                {...field} 
                disabled={isSaving} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* OBSERVACIONES CONDICIONALES */}
      {showObservations && (
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("itAssets.components.form.observations.label")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("itAssets.components.form.observations.placeholder")} 
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

export default ItAssetsForm;