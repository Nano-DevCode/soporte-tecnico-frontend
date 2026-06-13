import { useState, useEffect } from "react";
import { 
  Controller, 
  type Control, 
  type UseFormRegister, 
  type UseFormSetValue, 
  type FieldValues, 
  type FieldErrors, 
  type UseFormWatch 
} from "react-hook-form";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Package, Image as ImageIcon, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

import { CatalogSelector } from "./CatalogSelector";
import {
  useTypeConsumables,
  useBrandConsumables,
  useUbicationConsumables,
  useUnitMeasurementConsumables
} from "../hooks/useConsumableCatalog";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"; // Importamos para jalar la URL base si hiciera falta

export interface ConsumableInitialData {
  description?: string;
  id_type_consumable?: number | string;
  id_brand_consumable?: number | string;
  id_ubication_consumable?: number | string;
  id_unit_measurement?: number | string;
  number_uses?: number;
  imageUrl?: string | null; 
}

interface ConsumableFieldsProps {
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  disabled?: boolean;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  mode?: "create" | "update";
  initialData?: ConsumableInitialData;
}

export const ConsumableFields = ({
  control,
  register,
  setValue,
  disabled,
  errors,
  watch,
  mode = "create",
  initialData,
}: ConsumableFieldsProps) => {
  const typeHook = useTypeConsumables();
  const brandHook = useBrandConsumables();
  const ubicationHook = useUbicationConsumables();
  const unitHook = useUnitMeasurementConsumables();

  const isEditMode = mode === "update";
  
  // FUNCIÓN AUXILIAR: Si la URL del backend no viene completa, le pega el baseURL dinámicamente
  // const getFullImageUrl = (url: string | null | undefined) => {
  //   if (!url) return null;
  //   if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
  //     return url;
  //   }
  //   const backendBaseUrl = soporteTecnicoApi.defaults.baseURL?.replace(/\/api\/?$/, "") || "http://localhost:3000";
  //   return `${backendBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  // };

const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return null;

  // Si ya es una URL completa (http://..., https://... o data:...), la dejamos pasar limpia
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  // let backendBaseUrl = soporteTecnicoApi.defaults.baseURL || "http://localhost:3000/api";
  // 1. Jalamos el baseURL (que ya apunta a http://localhost:3000/api)
  const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
  // backendBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${backendBaseUrl}/${cleanUrl}`;
};
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => getFullImageUrl(initialData?.imageUrl));
  
  const currentImageFile = watch("consumable.imageUrl");
  const selectedUnit = watch("consumable.id_unit_measurement");
  const unitId = selectedUnit && typeof selectedUnit === "object" ? Number(selectedUnit.id) : Number(selectedUnit);

  // --- IGUAL QUE EN TOOLS: Controlamos la renderización y revocación del archivo de imagen ---
  useEffect(() => {
    let objectUrl: string | null = null;
    let timeoutId: number | undefined;

    if (currentImageFile && currentImageFile instanceof FileList && currentImageFile.length > 0) {
      const file = currentImageFile[0];
      objectUrl = URL.createObjectURL(file);
      timeoutId = window.setTimeout(() => setPreviewUrl(objectUrl), 0);
    } else if (initialData?.imageUrl) {
      timeoutId = window.setTimeout(() => setPreviewUrl(getFullImageUrl(initialData.imageUrl)), 0);
    } else {
      timeoutId = window.setTimeout(() => setPreviewUrl(null), 0);
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentImageFile, initialData]);

  const getBackendErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
      const msg = err.response.data.message;
      return Array.isArray(msg) ? msg.join(", ") : msg;
    }
    return defaultMsg;
  };

  const handleCreateType = async (name: string) => {
    try {
      const newItem = await sileo.promise(typeHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_type_consumable_loading") || "Creando tipo..." },
        success: { title: t("ui_type_consumable_success_title") || "Tipo creado con éxito" },
        error: (err) => ({ title: "Error", description: getBackendErrorMessage(err, "No se pudo crear") })
      });
      if (newItem) setValue("consumable.id_type_consumable", newItem, { shouldValidate: true });
    } catch (e) { console.error(e); }
  };

  const handleCreateBrand = async (name: string) => {
    try {
      const newItem = await sileo.promise(brandHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_brand_consumable_loading") || "Creando marca..." },
        success: { title: t("ui_brand_consumable_success_title") || "Marca creada con éxito" },
        error: (err) => ({ title: "Error", description: getBackendErrorMessage(err, "No se pudo crear") })
      });
      if (newItem) setValue("consumable.id_brand_consumable", newItem, { shouldValidate: true });
    } catch (e) { console.error(e); }
  };

  const handleCreateUbication = async (name: string) => {
    try {
      const newItem = await sileo.promise(ubicationHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_ubication_consumable_loading") || "Creando ubicación..." },
        success: { title: t("ui_ubication_consumable_success_title") || "Ubicación creada con éxito" },
        error: (err) => ({ title: "Error", description: getBackendErrorMessage(err, "No se pudo crear") })
      });
      if (newItem) setValue("consumable.id_ubication_consumable", newItem, { shouldValidate: true });
    } catch (e) { console.error(e); }
  };

  const consumableErrors = errors?.consumable as Record<string, { message: string }> | undefined;

  return (
    <div className="mt-6 p-6 border border-emerald-200 rounded-xl bg-emerald-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
      <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-emerald-200 pb-2 text-emerald-900">
        <Package size={18} className="text-emerald-700" />{" "}
        {isEditMode ? "Editar Especificaciones del Consumible" : "Especificaciones del Consumible"}
      </h3>

      {/* Descripción */}
      <div className="space-y-2 col-span-full">
        <Label className="text-xs font-bold uppercase">Descripción <span className="text-red-600">*</span></Label>
        <Input
          {...register("consumable.description", { required: "La descripción es obligatoria" })}
          type="text"
          disabled={disabled}
          placeholder="Ejemplo: Filtro de carbón activado"
          className="bg-white border-zinc-300 focus-visible:ring-emerald-600"
        />
        {consumableErrors?.description && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.description.message}</span>
        )}
      </div>

      {/* Selector: Tipo */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Tipo de Consumible <span className="text-red-600">*</span></Label>
        <Controller
          name="consumable.id_type_consumable"
          control={control}
          rules={{ required: "El tipo de consumible es requerido" }}
          render={({ field }) => (
            <CatalogSelector
              hookResult={typeHook}
              value={field.value}
              onChange={field.onChange}
              placeholder="Seleccionar tipo..."
              allowCreate
              onCreate={handleCreateType}
              disabled={disabled}
            />
          )}
        />
        {consumableErrors?.id_type_consumable && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.id_type_consumable.message}</span>
        )}
      </div>

      {/* Selector: Marca */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Marca <span className="text-red-600">*</span></Label>
        <Controller
          name="consumable.id_brand_consumable"
          control={control}
          rules={{ required: "La marca es requerida" }}
          render={({ field }) => (
            <CatalogSelector
              hookResult={brandHook}
              value={field.value}
              onChange={field.onChange}
              placeholder="Seleccionar marca..."
              allowCreate
              onCreate={handleCreateBrand}
              disabled={disabled}
            />
          )}
        />
        {consumableErrors?.id_brand_consumable && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.id_brand_consumable.message}</span>
        )}
      </div>

      {/* Selector: Ubicación */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Ubicación de Almacén <span className="text-red-600">*</span></Label>
        <Controller
          name="consumable.id_ubication_consumable"
          control={control}
          rules={{ required: "La ubicación es requerida" }}
          render={({ field }) => (
            <CatalogSelector
              hookResult={ubicationHook}
              value={field.value}
              onChange={field.onChange}
              placeholder="Seleccionar ubicación..."
              allowCreate
              onCreate={handleCreateUbication}
              disabled={disabled}
            />
          )}
        />
        {consumableErrors?.id_ubication_consumable && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.id_ubication_consumable.message}</span>
        )}
      </div>

      {/* Selector: Unidad de Medida */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Unidad de Medida <span className="text-red-600">*</span></Label>
        <Controller
          name="consumable.id_unit_measurement"
          control={control}
          rules={{ required: "La unidad de medida es requerida" }}
          render={({ field }) => (
            <CatalogSelector
              hookResult={unitHook}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                const numericId = val && typeof val === "object" ? Number(val.id) : Number(val);
                if (numericId !== 1) {
                  setValue("consumable.number_uses", 1, { shouldValidate: true });
                }
              }}
              placeholder="Seleccionar unidad..."
              disabled={disabled}
            />
          )}
        />
        {consumableErrors?.id_unit_measurement && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.id_unit_measurement.message}</span>
        )}
      </div>

      {/* Número de Usos */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase flex items-center gap-1">
          <Hash size={14} /> Número de Usos {unitId === 1 && <span className="text-red-600">*</span>}
        </Label>
        <Input
          {...register("consumable.number_uses", {
            valueAsNumber: true,
            required: {
              value: unitId === 1,
              message: "El número de usos es requerido para esta unidad"
            },
            min: { value: 1, message: "Debe ser al menos 1 uso" }
          })}
          type="number"
          min={1}
          disabled={disabled || unitId !== 1}
          placeholder="Ej. 10"
          className="bg-white border-zinc-300 focus-visible:ring-emerald-600"
        />
        {consumableErrors?.number_uses && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.number_uses.message}</span>
        )}
      </div>

      {/* Input de Imagen */}
      <div className="space-y-2 md:col-span-2">
        <Label className="text-xs font-bold uppercase flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-emerald-700" /> Imagen del Consumible {!isEditMode && <span className="text-red-500">*</span>}
        </Label>
        
        <Label 
          htmlFor="image-upload" 
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-emerald-600/50 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 font-medium hover:bg-emerald-100/50 transition-colors",
            consumableErrors?.imageUrl && "border-red-500 text-red-500 bg-red-500/5",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          {previewUrl ? "Cambiar archivo de imagen" : "Seleccionar archivo de imagen"}
          <Input 
            id="image-upload"
            type="file"
            accept="image/*"
            disabled={disabled}
            className="hidden" 
            {...register("consumable.imageUrl", { 
              required: !isEditMode ? "La imagen es obligatoria en la creación" : false
            })}
          />
        </Label>
        {consumableErrors?.imageUrl && (
          <span className="text-xs font-medium text-red-500 block">{consumableErrors.imageUrl.message}</span>
        )}
      </div>

      {/* Preview de imagen */}
      {previewUrl && (
        <div className="md:col-span-2 flex flex-col items-center justify-center pt-2">
          <div className="relative h-44 w-44 overflow-hidden rounded-xl border-2 border-dashed border-emerald-600/20 bg-white p-2">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
