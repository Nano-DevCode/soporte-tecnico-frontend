import React, { useState, useEffect } from "react";
import type { Control, UseFormRegister, UseFormSetValue, FieldValues, FieldErrors, UseFormWatch } from "react-hook-form";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";
import { Package } from "lucide-react";

// import { ConsumableFormFieldsGrid } from "./ConsumableFormFieldsGrid";
// import { ConsumableImageDropzone } from "./ConsumableImageDropzone";
// import { ConsumableFormActions } from "./ConsumableFormActions";
import {
  useTypeConsumables,
  useBrandConsumables,
  useUbicationConsumables,
  useUnitMeasurementConsumables
} from "../hooks/useConsumableCatalog";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { ConsumableFormFieldsGrid } from "./componentsConsumables/ConsumableFormFieldsGrid";
import { ConsumableImageDropzone } from "./componentsConsumables/ConsumableFormImageDropzone";
import { ConsumableFormActions } from "./componentsConsumables/ConsumableFormActions";

export interface ConsumableInitialData {
  name?: string;
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
  onCancel: () => void;
}

const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${backendBaseUrl}/${cleanUrl}`;
};

const getBackendErrorMessage = (err: unknown, defaultMsg: string): string => {
  let rawMessage: string | string[] = defaultMsg;
  if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
    rawMessage = err.response.data.message;
  } else if (err instanceof Error) {
    rawMessage = err.message;
  } else if (typeof err === "object" && err !== null && "message" in err) {
    rawMessage = (err as Record<string, unknown>).message as string | string[];
  } else if (typeof err === "string") {
    rawMessage = err;
  }
  return Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage;
};

const ConsumableFormHeader = ({ isEditMode }: { isEditMode: boolean }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-border w-full">
    <div className="flex h-11 w-11 shrink-0 justify-center rounded-lg bg-primary/10 text-primary items-center">
      <Package className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        {isEditMode ? t("consumables.form.title_update") : t("consumables.form.title_create")}
      </h2>
      <p className="text-sm font-medium text-muted-foreground">
        {isEditMode ? t("consumables.form.subtitle_update") : t("consumables.form.subtitle_create")}
      </p>
    </div>
  </div>
);

export const ConsumableFields: React.FC<ConsumableFieldsProps> = ({
  control,
  register,
  setValue,
  disabled,
  errors,
  watch,
  mode = "create",
  initialData,
  onCancel,
}) => {
  const typeHook = useTypeConsumables();
  const brandHook = useBrandConsumables();
  const ubicationHook = useUbicationConsumables();
  const unitHook = useUnitMeasurementConsumables();

  const isEditMode = mode === "update";
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => getFullImageUrl(initialData?.imageUrl));

  const currentImageFile = watch("consumable.imageUrl");
  const selectedUnit = watch("consumable.id_unit_measurement");
  const unitId = selectedUnit && typeof selectedUnit === "object" ? Number(selectedUnit.id) : Number(selectedUnit);

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
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentImageFile, initialData]);

  const handleCreateType = async (name: string) => {
    try {
      const newItem = await sileo.promise(typeHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_type_consumable_loading") || "Creando tipo..." },
        success: { title: t("ui_type_consumable_success_title") || "Tipo creado con éxito" },
        error: (err) => ({ 
          title: t("consumables.form.error_validation_title"), 
          description: getBackendErrorMessage(err, t("consumables.form.err_fallback_type")) 
        })
      });
      if (newItem) setValue("consumable.id_type_consumable", newItem, { shouldValidate: true });
    } catch (e) { void e; }
  };

  const handleCreateBrand = async (name: string) => {
    try {
      const newItem = await sileo.promise(brandHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_brand_consumable_loading") || "Creando marca..." },
        success: { title: t("ui_brand_consumable_success_title") || "Marca creado con éxito" },
        error: (err) => ({ 
          title: t("consumables.form.error_validation_title"), 
          description: getBackendErrorMessage(err, t("consumables.form.err_fallback_brand")) 
        })
      });
      if (newItem) setValue("consumable.id_brand_consumable", newItem, { shouldValidate: true });
    } catch (e) { void e; }
  };

  const handleCreateUbication = async (name: string) => {
    try {
      const newItem = await sileo.promise(ubicationHook.onCreate({ name: name.trim() }), {
        loading: { title: t("ui_ubication_consumable_loading") || "Creando ubicación..." },
        success: { title: t("ui_ubication_consumable_success_title") || "Ubicación creada con éxito" },
        error: (err) => ({ 
          title: t("consumables.form.error_validation_title"), 
          description: getBackendErrorMessage(err, t("consumables.form.err_fallback_ubication")) 
        })
      });
      if (newItem) setValue("consumable.id_ubication_consumable", newItem, { shouldValidate: true });
    } catch (e) { void e; }
  };

  const consumableErrors = errors?.consumable as Record<string, { message: string }> | undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm w-full space-y-6">
      <ConsumableFormHeader isEditMode={isEditMode} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        <ConsumableFormFieldsGrid 
          register={register}
          control={control}
          setValue={setValue}
          disabled={disabled}
          consumableErrors={consumableErrors}
          unitId={unitId}
          typeHook={typeHook}
          brandHook={brandHook}
          ubicationHook={ubicationHook}
          unitHook={unitHook}
          handleCreateType={handleCreateType}
          handleCreateBrand={handleCreateBrand}
          handleCreateUbication={handleCreateUbication}
        />

        <ConsumableImageDropzone 
          register={register}
          previewUrl={previewUrl}
          isEditMode={isEditMode}
          disabled={disabled}
          error={consumableErrors?.imageUrl}
        />
      </div>

      <ConsumableFormActions 
        disabled={disabled}
        isEditMode={isEditMode}
        onCancel={onCancel}
      />
    </div>
  );
};
// import { useState, useEffect } from "react";
// import {
//   Controller,
//   type Control,
//   type UseFormRegister,
//   type UseFormSetValue,
//   type FieldValues,
//   type FieldErrors,
//   type UseFormWatch
// } from "react-hook-form";
// import { sileo } from "sileo";
// import { isAxiosError } from "axios";
// import { t } from "i18next";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Package, Image as ImageIcon, Hash, AlertCircle, Save, X, Loader2, UploadCloud } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { CatalogSelector } from "./CatalogSelector";
// import {
//   useTypeConsumables,
//   useBrandConsumables,
//   useUbicationConsumables,
//   useUnitMeasurementConsumables
// } from "../hooks/useConsumableCatalog";
// import type { BackendError } from "@/interfaces/backendError.interfaces";
// import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

// export interface ConsumableInitialData {
//   name?: string;
//   description?: string;
//   id_type_consumable?: number | string;
//   id_brand_consumable?: number | string;
//   id_ubication_consumable?: number | string;
//   id_unit_measurement?: number | string;
//   number_uses?: number;
//   imageUrl?: string | null;
// }

// interface ConsumableFieldsProps {
//   control: Control<FieldValues>;
//   register: UseFormRegister<FieldValues>;
//   setValue: UseFormSetValue<FieldValues>;
//   disabled?: boolean;
//   errors: FieldErrors<FieldValues>;
//   watch: UseFormWatch<FieldValues>;
//   mode?: "create" | "update";
//   initialData?: ConsumableInitialData;
//   onCancel: () => void;
// }

// const getFullImageUrl = (url: string | null | undefined) => {
//   if (!url) return null;
//   if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
//     return url;
//   }
//   const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
//   const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
//   return `${backendBaseUrl}/${cleanUrl}`;
// };

// const getBackendErrorMessage = (err: unknown, defaultMsg: string): string => {
//   let rawMessage: string | string[] = defaultMsg;
//   if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
//     rawMessage = err.response.data.message;
//   } else if (err instanceof Error) {
//     rawMessage = err.message;
//   } else if (typeof err === "object" && err !== null && "message" in err) {
//     rawMessage = (err as Record<string, unknown>).message as string | string[];
//   } else if (typeof err === "string") {
//     rawMessage = err;
//   }
//   return Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage;
// };

// const ConsumableFormHeader = ({ isEditMode }: { isEditMode: boolean }) => (
//   <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-border w-full">
//     <div className="flex h-11 w-11 shrink-0 justify-center rounded-lg bg-primary/10 text-primary items-center">
//       <Package className="h-5 w-5" />
//     </div>
//     <div>
//       <h2 className="text-2xl font-bold text-foreground tracking-tight">
//         {isEditMode ? t("consumables.form.title_update") : t("consumables.form.title_create")}
//       </h2>
//       <p className="text-sm font-medium text-muted-foreground">
//         {isEditMode ? t("consumables.form.subtitle_update") : t("consumables.form.subtitle_create")}
//       </p>
//     </div>
//   </div>
// );
// interface ImageDropzoneProps {
//   register: UseFormRegister<FieldValues>;
//   previewUrl: string | null;
//   isEditMode: boolean;
//   disabled?: boolean;
//   error?: { message?: string };
// }

// const ConsumableImageDropzone = ({ register, previewUrl, isEditMode, disabled, error }: ImageDropzoneProps) => (
//   <div className="lg:col-span-1 flex flex-col justify-start space-y-2.5">
//     <Label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
//       <ImageIcon className="h-3.5 w-3.5" /> {t("consumables.form.label_image")} {!isEditMode && <span className="text-destructive">*</span>}
//     </Label>

//     <div className="relative group w-full aspect-square max-w-[260px] mx-auto lg:max-w-none">
//       <Label
//         htmlFor="image-upload"
//         className={cn(
//           "relative flex flex-col h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-4 text-center transition-all hover:bg-muted/50 hover:border-primary/40 overflow-hidden select-none",
//           previewUrl && "border-solid border-border bg-background p-1.5 shadow-sm hover:bg-background",
//           error && "border-destructive bg-destructive/5 text-destructive",
//           disabled && "opacity-50 cursor-not-allowed pointer-events-none"
//         )}
//       >
//         {previewUrl ? (
//           <div className="relative h-full w-full rounded-lg overflow-hidden bg-zinc-50 flex items-center justify-center">
//             <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-1 transition-transform group-hover:scale-[1.02] duration-200" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium transition-opacity duration-200">
//               <UploadCloud size={20} className="transition-transform duration-200 group-hover:-translate-y-1 ease-out" />
//               <span>{t("consumables.form.image_replace")}</span>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground py-6">
//             <div className="p-3 rounded-full bg-background border shadow-xs text-muted-foreground/70 group-hover:text-primary transition-colors">
//               <UploadCloud size={22} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
//             </div>
//             <div className="space-y-0.5">
//               <p className="text-xs font-bold text-foreground">{t("consumables.form.image_upload")}</p>
//               <p className="text-[10px] text-muted-foreground/80 font-normal">{t("consumables.form.image_formats")}</p>
//             </div>
//           </div>
//         )}

//         <Input
//           id="image-upload"
//           type="file"
//           accept="image/*"
//           disabled={disabled}
//           className="hidden"
//           {...register("consumable.imageUrl", {
//             required: !isEditMode ? t("consumables.form.error_required_image") : false
//           })}
//         />
//       </Label>
//     </div>

//     {error?.message && (
//       <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 justify-center lg:justify-start">
//         <AlertCircle size={13} /> {error.message}
//       </p>
//     )}
//   </div>
// );

// interface FieldsGridProps {
//   register: UseFormRegister<FieldValues>;
//   control: Control<FieldValues>;
//   setValue: UseFormSetValue<FieldValues>;
//   disabled?: boolean;
//   consumableErrors?: Record<string, { message: string }>;
//   unitId: number;
//   typeHook: ReturnType<typeof useTypeConsumables>;
//   brandHook: ReturnType<typeof useBrandConsumables>;
//   ubicationHook: ReturnType<typeof useUbicationConsumables>;
//   unitHook: ReturnType<typeof useUnitMeasurementConsumables>;
//   handleCreateType: (name: string) => Promise<void>;
//   handleCreateBrand: (name: string) => Promise<void>;
//   handleCreateUbication: (name: string) => Promise<void>;
// }

// const ConsumableFormFieldsGrid = ({
//   register,
//   control,
//   setValue,
//   disabled,
//   consumableErrors,
//   unitId,
//   typeHook,
//   brandHook,
//   ubicationHook,
//   unitHook,
//   handleCreateType,
//   handleCreateBrand,
//   handleCreateUbication
// }: FieldsGridProps) => (
//   <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 content-start">
//     {/* Nombre */}
//     <div className="space-y-1.5 md:col-span-2">
//       <Label className="text-[11px] font-bold uppercase tracking-wider ">
//         {t("consumables.form.label_name")} <span className="text-destructive">*</span>
//       </Label>
//       <Input
//         {...register("consumable.name", {
//           required: t("consumables.form.error_required_name"),
//           minLength: { value: 3, message: t("eq_form_validate_min_chars", { count: 3 }) },
//           maxLength: { value: 350, message: t("eq_form_validate_max_chars", { count: 150 }) }
//         })}
//         type="text"
//         disabled={disabled}
//         placeholder={t("consumables.form.placeholder_name")}
//         className={cn(
//           "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
//           consumableErrors?.name && "border-destructive bg-destructive/2 focus-visible:ring-destructive"
//         )}
//       />
//       {consumableErrors?.name && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.name.message}
//         </p>
//       )}
//     </div>

//     {/* Descripción */}
//     <div className="space-y-1.5 md:col-span-2">
//       <Label className="text-[11px] font-bold uppercase tracking-wider ">
//         {t("consumables.form.label_description")} <span className="text-destructive">*</span>
//       </Label>
//       <Input
//         {...register("consumable.description", {
//           required: t("consumables.form.error_required_description"),
//           minLength: { value: 3, message: t("eq_form_validate_min_chars", { count: 3 }) },
//           maxLength: { value: 350, message: t("eq_form_validate_max_chars", { count: 150 }) }
//         })}
//         type="text"
//         disabled={disabled}
//         placeholder={t("consumables.form.placeholder_description")}
//         className={cn(
//           "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
//           consumableErrors?.description && "border-destructive bg-destructive/2 focus-visible:ring-destructive"
//         )}
//       />
//       {consumableErrors?.description && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.description.message}
//         </p>
//       )}
//     </div>

//     {/* Tipo de Consumible */}
//     <div className="space-y-1.5">
//       <Label className="text-[11px] font-bold uppercase tracking-wider">
//         {t("consumables.form.label_type")} <span className="text-destructive">*</span>
//       </Label>
//       <Controller
//         name="consumable.id_type_consumable"
//         control={control}
//         rules={{ required: t("consumables.form.error_required_type") }}
//         render={({ field }) => (
//           <CatalogSelector
//             hookResult={typeHook}
//             value={field.value}
//             onChange={field.onChange}
//             placeholder={t("consumables.form.placeholder_type")}
//             allowCreate={true}
//             onCreate={handleCreateType}
//             disabled={disabled}
//           />
//         )}
//       />
//       {consumableErrors?.id_type_consumable && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.id_type_consumable.message}
//         </p>
//       )}
//     </div>

//     {/* Marca */}
//     <div className="space-y-1.5">
//       <Label className="text-[11px] font-bold uppercase tracking-wider">
//         {t("consumables.form.label_brand")} <span className="text-destructive">*</span>
//       </Label>
//       <Controller
//         name="consumable.id_brand_consumable"
//         control={control}
//         rules={{ required: t("consumables.form.error_required_brand") }}
//         render={({ field }) => (
//           <CatalogSelector
//             hookResult={brandHook}
//             value={field.value}
//             onChange={field.onChange}
//             placeholder={t("consumables.form.placeholder_brand")}
//             allowCreate
//             onCreate={handleCreateBrand}
//             disabled={disabled}
//           />
//         )}
//       />
//       {consumableErrors?.id_brand_consumable && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.id_brand_consumable.message}
//         </p>
//       )}
//     </div>

//     {/* Unidad de Medida */}
//     <div className="space-y-1.5">
//       <Label className="text-[11px] font-bold uppercase tracking-wider ">
//         {t("consumables.form.label_unit")} <span className="text-destructive">*</span>
//       </Label>
//       <Controller
//         name="consumable.id_unit_measurement"
//         control={control}
//         rules={{ required: t("consumables.form.error_required_unit") }}
//         render={({ field }) => (
//           <CatalogSelector
//             hookResult={unitHook}
//             value={field.value}
//             onChange={(val) => {
//               field.onChange(val);
//               const numericId = val && typeof val === "object" ? Number(val.id) : Number(val);
//               if (numericId !== 1) {
//                 setValue("consumable.number_uses", 1, { shouldValidate: true });
//               }
//             }}
//             placeholder={t("consumables.form.placeholder_unit")}
//             disabled={disabled}
//           />
//         )}
//       />
//       {consumableErrors?.id_unit_measurement && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.id_unit_measurement.message}
//         </p>
//       )}
//     </div>

//     {/* Número de Usos */}
//     <div className="space-y-1.5">
//       <Label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
//         <Hash size={13} /> {t("consumables.form.label_uses")} {unitId === 1 && <span className="text-destructive">*</span>}
//       </Label>
//       <Input
//         {...register("consumable.number_uses", {
//           valueAsNumber: true,
//           required: {
//             value: unitId === 1,
//             message: t("consumables.form.error_required_uses")
//           },
//           min: { value: 1, message: t("consumables.form.error_min_uses") }
//         })}
//         type="number"
//         min={1}
//         disabled={disabled || unitId !== 1}
//         placeholder={t("consumables.form.placeholder_uses")}
//         className={cn(
//           "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
//           consumableErrors?.number_uses && "border-destructive bg-destructive/5 focus-visible:ring-destructive"
//         )}
//       />
//       {consumableErrors?.number_uses && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.number_uses.message}
//         </p>
//       )}
//     </div>

//     {/* Ubicación de Almacén */}
//     <div className="space-y-1.5 md:col-span-2">
//       <Label className="text-[11px] font-bold uppercase tracking-wider">
//         {t("consumables.form.label_ubication")} <span className="text-destructive">*</span>
//       </Label>
//       <Controller
//         name="consumable.id_ubication_consumable"
//         control={control}
//         rules={{ required: t("consumables.form.error_required_ubication") }}
//         render={({ field }) => (
//           <CatalogSelector
//             hookResult={ubicationHook}
//             value={field.value}
//             onChange={field.onChange}
//             placeholder={t("consumables.form.placeholder_ubication")}
//             allowCreate
//             onCreate={handleCreateUbication}
//             disabled={disabled}
//           />
//         )}
//       />
//       {consumableErrors?.id_ubication_consumable && (
//         <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
//           <AlertCircle size={13} /> {consumableErrors.id_ubication_consumable.message}
//         </p>
//       )}
//     </div>
//   </div>
// );

// interface FormActionsProps {
//   disabled?: boolean;
//   isEditMode: boolean;
//   onCancel: () => void;
// }

// const ConsumableFormActions = ({ disabled, isEditMode, onCancel }: FormActionsProps) => (
//   <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border w-full">
//     <Button
//       type="button"
//       variant="outline"
//       disabled={disabled}
//       onClick={onCancel}
//       className="h-10 px-5 text-sm font-medium"
//     >
//       <X size={16} className="mr-2" />
//       {t("consumables.form.btn_cancel")}
//     </Button>
//     <Button
//       type="submit"
//       disabled={disabled}
//       className={cn(
//         "h-10 px-6 font-semibold text-white min-w-[130px] shadow-sm transition-all active:scale-[0.98]",
//         isEditMode ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
//       )}
//     >
//       {disabled ? (
//         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//       ) : (
//         <Save size={16} className="mr-2" />
//       )}
//       {disabled 
//         ? (isEditMode ? t("consumables.form.btn_updating") : t("consumables.form.btn_saving")) 
//         : (isEditMode ? t("consumables.form.btn_update") : t("consumables.form.btn_save"))}
//     </Button>
//   </div>
// );

// export const ConsumableFields = ({
//   control,
//   register,
//   setValue,
//   disabled,
//   errors,
//   watch,
//   mode = "create",
//   initialData,
//   onCancel,
// }: ConsumableFieldsProps) => {
  
//   const typeHook = useTypeConsumables();
//   const brandHook = useBrandConsumables();
//   const ubicationHook = useUbicationConsumables();
//   const unitHook = useUnitMeasurementConsumables();

//   const isEditMode = mode === "update";
//   const [previewUrl, setPreviewUrl] = useState<string | null>(() => getFullImageUrl(initialData?.imageUrl));

//   const currentImageFile = watch("consumable.imageUrl");
//   const selectedUnit = watch("consumable.id_unit_measurement");
//   const unitId = selectedUnit && typeof selectedUnit === "object" ? Number(selectedUnit.id) : Number(selectedUnit);

//   useEffect(() => {
//     let objectUrl: string | null = null;
//     let timeoutId: number | undefined;

//     if (currentImageFile && currentImageFile instanceof FileList && currentImageFile.length > 0) {
//       const file = currentImageFile[0];
//       objectUrl = URL.createObjectURL(file);
//       timeoutId = window.setTimeout(() => setPreviewUrl(objectUrl), 0);
//     } else if (initialData?.imageUrl) {
//       timeoutId = window.setTimeout(() => setPreviewUrl(getFullImageUrl(initialData.imageUrl)), 0);
//     } else {
//       timeoutId = window.setTimeout(() => setPreviewUrl(null), 0);
//     }

//     return () => {
//       if (timeoutId !== undefined) window.clearTimeout(timeoutId);
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [currentImageFile, initialData]);

//   const handleCreateType = async (name: string) => {
//     try {
//       const newItem = await sileo.promise(typeHook.onCreate({ name: name.trim() }), {
//         loading: { title: t("ui_type_consumable_loading") || "Creando tipo..." },
//         success: { title: t("ui_type_consumable_success_title") || "Tipo creado con éxito" },
//         error: (err) => ({ 
//           title: t("consumables.form.error_validation_title"), 
//           description: getBackendErrorMessage(err, t("consumables.form.err_fallback_type")) 
//         })
//       });
//       if (newItem) setValue("consumable.id_type_consumable", newItem, { shouldValidate: true });
//     } catch (e) { void e; }
//   };

//   const handleCreateBrand = async (name: string) => {
//     try {
//       const newItem = await sileo.promise(brandHook.onCreate({ name: name.trim() }), {
//         loading: { title: t("ui_brand_consumable_loading") || "Creando marca..." },
//         success: { title: t("ui_brand_consumable_success_title") || "Marca creado con éxito" },
//         error: (err) => ({ 
//           title: t("consumables.form.error_validation_title"), 
//           description: getBackendErrorMessage(err, t("consumables.form.err_fallback_brand")) 
//         })
//       });
//       if (newItem) setValue("consumable.id_brand_consumable", newItem, { shouldValidate: true });
//     } catch (e) { void e; }
//   };

//   const handleCreateUbication = async (name: string) => {
//     try {
//       const newItem = await sileo.promise(ubicationHook.onCreate({ name: name.trim() }), {
//         loading: { title: t("ui_ubication_consumable_loading") || "Creando ubicación..." },
//         success: { title: t("ui_ubication_consumable_success_title") || "Ubicación creada con éxito" },
//         error: (err) => ({ 
//           title: t("consumables.form.error_validation_title"), 
//           description: getBackendErrorMessage(err, t("consumables.form.err_fallback_ubication")) 
//         })
//       });
//       if (newItem) setValue("consumable.id_ubication_consumable", newItem, { shouldValidate: true });
//     } catch (e) { void e; }
//   };

//   const consumableErrors = errors?.consumable as Record<string, { message: string }> | undefined;

//   return (
//     <div className="rounded-xl border border-border bg-card p-6 shadow-sm w-full space-y-6">
//       <ConsumableFormHeader isEditMode={isEditMode} />

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
//         <ConsumableFormFieldsGrid 
//           register={register}
//           control={control}
//           setValue={setValue}
//           disabled={disabled}
//           consumableErrors={consumableErrors}
//           unitId={unitId}
//           typeHook={typeHook}
//           brandHook={brandHook}
//           ubicationHook={ubicationHook}
//           unitHook={unitHook}
//           handleCreateType={handleCreateType}
//           handleCreateBrand={handleCreateBrand}
//           handleCreateUbication={handleCreateUbication}
//         />

//         <ConsumableImageDropzone 
//           register={register}
//           previewUrl={previewUrl}
//           isEditMode={isEditMode}
//           disabled={disabled}
//           error={consumableErrors?.imageUrl}
//         />
//       </div>

//       <ConsumableFormActions 
//         disabled={disabled}
//         isEditMode={isEditMode}
//         onCancel={onCancel}
//       />
//     </div>
//   );
// };