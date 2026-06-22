// components/equipment/NetworkFields.tsx
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { Controller, type Control, type FieldErrors, type FieldValues, type UseFormRegister, type UseFormSetValue, type FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CatalogSelector } from "../hooks/useCatalogs";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";

// Hook de Catálogo de Red
import { useNetworkTypes } from "../hooks/use-equipment-catalog";
import type { BackendError } from "@/interfaces/backendError.interfaces";

interface NetworkFieldsProps {
    control: Control<FieldValues>;
    register: UseFormRegister<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    disabled: boolean;
    errors: FieldErrors<FieldValues>;
}

export const NetworkFields = ({ control, register, setValue, disabled, errors }: NetworkFieldsProps) => {
    // 1. Instanciamos el hook
    const networkHook = useNetworkTypes();

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

    // --- Handler de Creación Rápida Inline con Sileo ---
    const handleCreateNetworkType = async (name: string) => {
    try {
        const newItem = await sileo.promise(networkHook.onCreate({ name: name.trim() }), {
            loading: { title: t("eq_network_toast_loading") },
            success: {
                title: t("eq_network_toast_success_title"),
                description: `${t("eq_network_toast_success_desc_1")} "${name}" ${t("eq_network_toast_success_desc_2")}`,
                duration: 4000
            },
            error: (err) => ({
                title: t("eq_network_toast_error_title"),
                description: getBackendErrorMessage(err, t("eq_network_toast_error_desc")),
                duration: 5000
            })
        });

        if (newItem) {
            setValue("network.id_type_equipment_network", newItem, { shouldValidate: true });
        }
    } catch {
    }
};

    // Helper rápido para obtener los errores anidados de la propiedad network
    const networkErrors = errors?.network as Record<string, FieldError> | undefined;

    return (
        <div className="mt-6 p-6 border border-orange-200 rounded-xl bg-orange-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-orange-200 pb-2">
                <Network size={18} className="text-orange-600" /> {t("eq_network_section_title")}
            </h3>

            {/* Tipo de Red */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("eq_network_label_type")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="network.id_type_equipment_network"
                    control={control}
                    rules={{ required: t("eq_network_error_type_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={networkHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder={t("eq_network_placeholder_type")}
                            allowCreate={true}
                            onCreate={handleCreateNetworkType}
                        />
                    )}
                />
                {networkErrors?.id_type_equipment_network && (
                    <span className="text-xs font-medium text-red-500 block">
                        {networkErrors.id_type_equipment_network.message}
                    </span>
                )}
            </div>

            {/* Número de Puertos */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("eq_network_label_ports")} <span className="text-red-600">*</span></Label>
                <Input
                    type="number"
                    {...register("network.number_ports", {
                        required: t("eq_network_error_ports_required"),
                        min: { value: 1, message: t("eq_network_error_ports_min") }
                    })}
                    placeholder="Ej. 24"
                    disabled={disabled}
                    className="bg-white border-zinc-300 focus:ring-orange-500"
                />
                {networkErrors?.number_ports && (
                    <span className="text-xs font-medium text-red-500 block">
                        {networkErrors.number_ports.message}
                    </span>
                )}
            </div>

            {/* PoE Checkbox */}
            <div className="flex items-center space-x-4 md:col-span-2 pt-2">
                <Controller
                    name="network.PoE"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-5">
                            <Label
                                htmlFor="is-poe"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                {t("eq_network_label_poe_question")}
                            </Label>
                            <Checkbox
                                id="is-poe"
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                                className="border-zinc-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};