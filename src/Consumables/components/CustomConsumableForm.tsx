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
