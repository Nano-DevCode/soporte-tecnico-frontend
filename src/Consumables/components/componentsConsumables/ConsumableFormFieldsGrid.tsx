import React from "react";
import { type UseFormRegister, type Control, type UseFormSetValue, type FieldValues, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CatalogSelector } from "../CatalogSelector";
import { AlertCircle, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import {
    useTypeConsumables,
    useBrandConsumables,
    useUbicationConsumables,
    useUnitMeasurementConsumables} from "@/Consumables/hooks/useConsumableCatalog"

interface FieldsGridProps {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    disabled?: boolean;
    consumableErrors?: Record<string, { message: string }>;
    unitId: number;
    typeHook: ReturnType<typeof useTypeConsumables>;
    brandHook: ReturnType<typeof useBrandConsumables>;
    ubicationHook: ReturnType<typeof useUbicationConsumables>;
    unitHook: ReturnType<typeof useUnitMeasurementConsumables>;
    handleCreateType: (name: string) => Promise<void>;
    handleCreateBrand: (name: string) => Promise<void>;
    handleCreateUbication: (name: string) => Promise<void>;
}

export const ConsumableFormFieldsGrid: React.FC<FieldsGridProps> = ({
    register,
    control,
    setValue,
    disabled,
    consumableErrors,
    unitId,
    typeHook,
    brandHook,
    ubicationHook,
    unitHook,
    handleCreateType,
    handleCreateBrand,
    handleCreateUbication
}) => (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 content-start">
        {/* Nombre */}
        <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_name")} <span className="text-destructive">*</span>
            </Label>
            <Input
                {...register("consumable.name", {
                    required: t("consumables.form.error_required_name"),
                    minLength: { value: 3, message: t("eq_form_validate_min_chars", { count: 3 }) },
                    maxLength: { value: 350, message: t("eq_form_validate_max_chars", { count: 150 }) }
                })}
                type="text"
                disabled={disabled}
                placeholder={t("consumables.form.placeholder_name")}
                className={cn(
                    "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
                    consumableErrors?.name && "border-destructive bg-destructive/2 focus-visible:ring-destructive"
                )}
            />
            {consumableErrors?.name && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.name.message}
                </p>
            )}
        </div>

        {/* Descripción */}
        <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_description")} <span className="text-destructive">*</span>
            </Label>
            <Input
                {...register("consumable.description", {
                    required: t("consumables.form.error_required_description"),
                    minLength: { value: 3, message: t("eq_form_validate_min_chars", { count: 3 }) },
                    maxLength: { value: 350, message: t("eq_form_validate_max_chars", { count: 150 }) }
                })}
                type="text"
                disabled={disabled}
                placeholder={t("consumables.form.placeholder_description")}
                className={cn(
                    "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
                    consumableErrors?.description && "border-destructive bg-destructive/2 focus-visible:ring-destructive"
                )}
            />
            {consumableErrors?.description && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.description.message}
                </p>
            )}
        </div>

        {/* Tipo de Consumible */}
        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_type")} <span className="text-destructive">*</span>
            </Label>
            <Controller
                name="consumable.id_type_consumable"
                control={control}
                rules={{ required: t("consumables.form.error_required_type") }}
                render={({ field }) => (
                    <CatalogSelector
                        hookResult={typeHook}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("consumables.form.placeholder_type")}
                        allowCreate={true}
                        onCreate={handleCreateType}
                        disabled={disabled}
                    />
                )}
            />
            {consumableErrors?.id_type_consumable && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.id_type_consumable.message}
                </p>
            )}
        </div>

        {/* Marca */}
        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_brand")} <span className="text-destructive">*</span>
            </Label>
            <Controller
                name="consumable.id_brand_consumable"
                control={control}
                rules={{ required: t("consumables.form.error_required_brand") }}
                render={({ field }) => (
                    <CatalogSelector
                        hookResult={brandHook}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("consumables.form.placeholder_brand")}
                        allowCreate
                        onCreate={handleCreateBrand}
                        disabled={disabled}
                    />
                )}
            />
            {consumableErrors?.id_brand_consumable && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.id_brand_consumable.message}
                </p>
            )}
        </div>

        {/* Unidad de Medida */}
        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_unit")} <span className="text-destructive">*</span>
            </Label>
            <Controller
                name="consumable.id_unit_measurement"
                control={control}
                rules={{ required: t("consumables.form.error_required_unit") }}
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
                        placeholder={t("consumables.form.placeholder_unit")}
                        disabled={disabled}
                    />
                )}
            />
            {consumableErrors?.id_unit_measurement && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.id_unit_measurement.message}
                </p>
            )}
        </div>

        {/* Número de Usos */}
        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Hash size={13} /> {t("consumables.form.label_uses")} {unitId === 1 && <span className="text-destructive">*</span>}
            </Label>
            <Input
                {...register("consumable.number_uses", {
                    valueAsNumber: true,
                    required: {
                        value: unitId === 1,
                        message: t("consumables.form.error_required_uses")
                    },
                    min: { value: 1, message: t("consumables.form.error_min_uses") }
                })}
                type="number"
                min={1}
                disabled={disabled || unitId !== 1}
                placeholder={t("consumables.form.placeholder_uses")}
                className={cn(
                    "bg-background border-input focus:ring-0 focus-visible:ring-1 focus-visible:ring-primary h-10 w-full transition-shadow shadow-sm",
                    consumableErrors?.number_uses && "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                )}
            />
            {consumableErrors?.number_uses && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.number_uses.message}
                </p>
            )}
        </div>

        {/* Ubicación de Almacén */}
        <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider">
                {t("consumables.form.label_ubication")} <span className="text-destructive">*</span>
            </Label>
            <Controller
                name="consumable.id_ubication_consumable"
                control={control}
                rules={{ required: t("consumables.form.error_required_ubication") }}
                render={({ field }) => (
                    <CatalogSelector
                        hookResult={ubicationHook}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("consumables.form.placeholder_ubication")}
                        allowCreate
                        onCreate={handleCreateUbication}
                        disabled={disabled}
                    />
                )}
            />
            {consumableErrors?.id_ubication_consumable && (
                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    <AlertCircle size={13} /> {consumableErrors.id_ubication_consumable.message}
                </p>
            )}
        </div>
    </div>
);