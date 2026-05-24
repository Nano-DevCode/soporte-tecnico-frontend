import { useState } from "react";
import { Controller, type Control, type UseFormRegister, type UseFormSetValue, type FieldValues, type FieldErrors, type FieldError } from "react-hook-form";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Monitor, PlusCircle } from "lucide-react";
// Components & Hooks
import { CatalogSelector } from "../hooks/useCatalogs";
import { CreateProcessorModal } from './createProcessorDialog';
import {
    useProcessors,
    useOperatingSystems,
    useStorageTypes,
    useComputerTypes
} from "../hooks/use-equipment-catalog";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { t } from "i18next";

interface ComputerFieldsProps {
    control: Control<FieldValues>;
    register: UseFormRegister<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    disabled?: boolean;
    errors: FieldErrors<FieldValues>;
}

export const ComputerFields = ({ control, register, setValue, disabled, errors }: ComputerFieldsProps) => {
    const [isProcessorModalOpen, setIsProcessorModalOpen] = useState(false);

    // Catalogs Hooks
    const processorHookInstance = useProcessors();
    const osHook = useOperatingSystems();
    const storageHook = useStorageTypes();
    const typeHook = useComputerTypes();

    // --- Manejador genérico de errores para Axios ---
    const getBackendErrorMessage = (err: unknown, defaultMsg: string): string => {
        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const msg = err.response.data.message;
            return Array.isArray(msg) ? msg.join(", ") : msg;
        }
        if (err instanceof Error) return err.message.replace(/^Error:\s*/i, "");
        if (typeof err === "string") return err;
        return defaultMsg;
    };

    // --- Handlers de Creación Rápida Inline con Sileo ---
    const handleCreateComputerType = async (name: string) => {
        try {
            const newItem = await sileo.promise(typeHook.onCreate({ name: name.trim() }), {
                loading: { title: t("ui_computer_type_loading") },
                success: { title: t("ui_computer_type_success_title"), description: t("ui_computer_type_success_desc", { name }), duration: 4000 },
                error: (err) => ({ title: t("ui_computer_type_error_title"), description: getBackendErrorMessage(err, t("ui_computer_type_error_desc")), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_equipment_computer", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateOS = async (name: string) => {
        try {
            const newItem = await sileo.promise(osHook.onCreate({ name: name.trim() }), {
                loading: { title: t("ui_os_loading") },
                success: { title: t("ui_os_success_title"), description: t("ui_os_success_desc", { name }), duration: 4000 },
                error: (err) => ({ title: t("ui_os_error_title"), description: getBackendErrorMessage(err, t("ui_os_error_desc")), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_operating_system", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateStorage = async (name: string) => {
        try {
            const newItem = await sileo.promise(storageHook.onCreate({ name: name.trim() }), {
                loading: { title: t("ui_storage_loading") },
                success: { title: t("ui_storage_success_title"), description: t("ui_storage_success_desc", { name }), duration: 4000 },
                error: (err) => ({ title: t("ui_storage_error_title"), description: getBackendErrorMessage(err, t("ui_storage_error_desc")), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_storage", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateProcessor = async (data: Record<string, string>) => {
        try {
            const newItem = await sileo.promise(processorHookInstance.onCreate(data), {
                loading: { title: t("ui_processor_loading") },
                success: { title: t("ui_processor_success_title"), description: t("ui_processor_success_desc", { brand: data.brand, model: data.model }), duration: 4000 },
                error: (err) => ({ title: t("ui_processor_save_error_title"), description: getBackendErrorMessage(err, t("ui_processor_save_error_desc")), duration: 5000 })
            });

            if (newItem) {
                const fullName = `${newItem.brand} ${newItem.model} ${newItem.description || ""}`.trim();

                setValue("computer.id_processor", {
                    id: newItem.id,
                    name: fullName
                }, { shouldValidate: true });

                processorHookInstance.setSelectedId(newItem.id);
                return newItem;
            }
        } catch (error) {
            console.error("Error en la creación independiente del procesador:", error);
            throw error;
        }
    };

    const computerErrors = errors?.computer as Record<string, FieldError> | undefined;

    return (
        <div className="mt-6 p-6 border border-blue-200 rounded-xl bg-blue-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-blue-200 pb-2">
                <Monitor size={18} className="text-blue-700" /> {t("ui_computer_specs_title")}
            </h3>

            {/* Tipo de Equipo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_type_label")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_equipment_computer"
                    control={control}
                    rules={{ required: t("valid_computer_type_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typeHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            disabled={disabled}
                            onChange={(val) => field.onChange(val)}
                            placeholder={t("ui_computer_type_placeholder")}
                            allowCreate={true}
                            onCreate={handleCreateComputerType}
                        />
                    )}
                />
                {computerErrors?.id_type_equipment_computer && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.id_type_equipment_computer.message}</span>
                )}
            </div>

            {/* Procesador */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase">{t("ui_computer_processor_label")} <span className="text-red-600">*</span></Label>
                    <Button
                        type="button"
                        variant="link"
                        disabled={disabled}
                        className="h-auto p-0 text-[12px] text-blue-600 hover:text-blue-800 uppercase font-bold flex items-center gap-1"
                        onClick={() => setIsProcessorModalOpen(true)}
                    >
                        <PlusCircle size={12} /> {t("ui_btn_add")}
                    </Button>
                </div>
                <Controller
                    name="computer.id_processor"
                    control={control}
                    rules={{ required: t("valid_computer_processor_required") }}
                    render={({ field }) => {
                        const selectedValue = field.value;
                        let displayValue = null;

                        if (selectedValue) {
                            if (typeof selectedValue === 'object') {
                                displayValue = {
                                    id: selectedValue.id,
                                    name: selectedValue.name || `${selectedValue.brand || ''} ${selectedValue.model || ''} ${selectedValue.description || ''}`.trim()
                                };
                            } else {
                                displayValue = { id: selectedValue, name: "" };
                            }
                        }

                        return (
                            <CatalogSelector
                                hook={processorHookInstance}
                                value={displayValue}
                                onChange={field.onChange}
                                disabled={disabled}
                                allowCreate={false}
                                placeholder={t("ui_computer_processor_placeholder")}
                            />
                        );
                    }}
                />
                {computerErrors?.id_processor && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.id_processor.message}</span>
                )}
            </div>

            {/* Sistema Operativo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_os_label")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_operating_system"
                    control={control}
                    rules={{ required: t("valid_computer_os_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={osHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder={t("ui_computer_os_placeholder")}
                            allowCreate={true}
                            onCreate={handleCreateOS}
                        />
                    )}
                />
                {computerErrors?.id_type_operating_system && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.id_type_operating_system.message}</span>
                )}
            </div>

            {/* Almacenamiento */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_storage_label")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_storage"
                    control={control}
                    rules={{ required: t("valid_computer_storage_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={storageHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder={t("ui_computer_storage_placeholder")}
                            allowCreate={true}
                            onCreate={handleCreateStorage}
                        />
                    )}
                />
                {computerErrors?.id_type_storage && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.id_type_storage.message}</span>
                )}
            </div>

            {/* RAM */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_ram_label")} <span className="text-red-600">*</span></Label>
                <Input
                    {...register("computer.ram", {
                        required: t("valid_computer_ram_required"),
                        min: { value: 1, message: t("valid_computer_ram_min_val") }
                    })}
                    type="number"
                    disabled={disabled}
                    placeholder="Ej. 16"
                    className="bg-white border-zinc-300"
                />
                {computerErrors?.ram && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.ram.message}</span>
                )}
            </div>

            {/* Capacidad total de almacenamiento */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_capacity_label")} <span className="text-red-600">*</span></Label>
                <Input
                    {...register("computer.capacity_storage", {
                        required: t("valid_computer_capacity_required"),
                        min: { value: 1, message: t("valid_computer_capacity_min_val") }
                    })}
                    type="number"
                    disabled={disabled}
                    placeholder="Ej. 1000"
                    className="bg-white border-zinc-300"
                />
                {computerErrors?.capacity_storage && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.capacity_storage.message}</span>
                )}
            </div>

            {/* Espacio Disponible */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("ui_computer_available_label")} <span className="text-red-600">*</span></Label>
                <Input
                    {...register("computer.available_storage", {
                        required: t("valid_computer_available_required"),
                        min: { value: 0, message: t("valid_computer_available_min_val") }
                    })}
                    type="number"
                    disabled={disabled}
                    placeholder="Ej. 500"
                    className="bg-white border-zinc-300"
                />
                {computerErrors?.available_storage && (
                    <span className="text-xs font-medium text-red-500 block">{computerErrors.available_storage.message}</span>
                )}
            </div>

            <CreateProcessorModal
                isOpen={isProcessorModalOpen}
                onClose={() => setIsProcessorModalOpen(false)}
                isSubmitting={processorHookInstance.isCreating}
                onSave={handleCreateProcessor}
            />
        </div>
    );
};