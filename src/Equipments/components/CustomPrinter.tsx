// components/equipment/PrinterFields.tsx
import { Label } from "@/components/ui/label";
import { AlertCircle, Printer } from "lucide-react";
import { Controller, type Control, type UseFormRegister, type UseFormSetValue, type FieldValues, type FieldErrors, type FieldError } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CatalogSelector } from "../hooks/useCatalogs";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";

// Hooks de Catálogos simplificados
import {
    usePrinterFunctions,
    usePrintingTypes
} from "../hooks/use-equipment-catalog";
import type { BackendError } from "@/interfaces/backendError.interfaces";

interface PrinterFieldsProps {
    control: Control<FieldValues>;
    register: UseFormRegister<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    disabled: boolean;
    errors: FieldErrors<FieldValues>;
}

export const PrinterFields = ({ control, register, setValue, disabled, errors }: PrinterFieldsProps) => {
    // 1. Instanciamos los hooks
    const functionsHook = usePrinterFunctions();
    const typesHook = usePrintingTypes();

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
    const handleCreatePrinterFunction = async (name: string) => {
        try {
            const newItem = await sileo.promise(functionsHook.onCreate({ name: name.trim() }), {
                loading: { title: t("eq_printer_toast_func_loading") },
                success: {
                    title: t("eq_printer_toast_func_success_title"),
                    description: `${t("eq_printer_toast_func_success_desc_1")} "${name}" ${t("eq_printer_toast_func_success_desc_2")}`,
                    duration: 4000
                },
                error: (err) => ({
                    title: t("eq_printer_toast_func_error_title"),
                    description: getBackendErrorMessage(err, t("eq_printer_toast_func_error_desc")),
                    duration: 5000
                })
            });
            if (newItem) {
                setValue("printer.id_type_function", newItem, { shouldValidate: true });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreatePrintingType = async (name: string) => {
        try {
            const newItem = await sileo.promise(typesHook.onCreate({ name: name.trim() }), {
                loading: { title: t("eq_printer_toast_type_loading") },
                success: {
                    title: t("eq_printer_toast_type_success_title"),
                    description: `${t("eq_printer_toast_type_success_desc_1")} "${name}" ${t("eq_printer_toast_type_success_desc_2")}`,
                    duration: 4000
                },
                error: (err) => ({
                    title: t("eq_printer_toast_type_error_title"),
                    description: getBackendErrorMessage(err, t("eq_printer_toast_type_error_desc")),
                    duration: 5000
                })
            });
            if (newItem) {
                setValue("printer.id_type_printing", newItem, { shouldValidate: true });
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Helper rápido para obtener los errores anidados de la propiedad printer
    const printerErrors = errors?.printer as Record<string, FieldError> | undefined;

    return (
        <div className="mt-6 p-6 border border-purple-200 rounded-xl bg-purple-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-purple-200 pb-3">
                <Printer size={18} className="text-purple-600" /> {t("eq_printer_section_title")}
            </h3>

            {/* Función de Impresora */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("eq_printer_label_function")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_function"
                    control={control}
                    rules={{ required: t("eq_printer_error_func_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={functionsHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder={t("eq_printer_placeholder_function")}
                            allowCreate={true}
                            onCreate={handleCreatePrinterFunction}
                        />
                    )}
                />
                {printerErrors?.id_type_function && (
                    <span className="text-xs font-medium text-red-500 block">
                        {printerErrors.id_type_function.message}
                    </span>
                )}
            </div>

            {/* Tecnología / Tipo de Impresión */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("eq_printer_label_print_type")} <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_printing"
                    control={control}
                    rules={{ required: t("eq_printer_error_type_required") }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typesHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder={t("eq_printer_placeholder_print_type")}
                            allowCreate={true}
                            onCreate={handleCreatePrintingType}
                        />
                    )}
                />
                {printerErrors?.id_type_printing && (
                    <span className="text-xs font-medium text-red-500 block">
                        {printerErrors.id_type_printing.message}
                    </span>
                )}
            </div>

            {/* Modelo de Tóner (Opcional - Sin asterisco) */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">{t("eq_printer_label_toner")}</Label>
                <Input
                    {...register("printer.model_toner", {
                        required: t("eq_printer_error_toner_required"),
                        minLength: { value: 3, message: t("eq_printer_error_toner_min") },
                        maxLength: { value: 150, message: t("eq_printer_error_toner_max") }
                    })}
                    placeholder="Ej. HP 85A, TN-2410"
                    disabled={disabled}
                    className={`bg-slate-50/50 border-zinc-300 focus:ring-0 ${printerErrors?.model_toner ? 'border-red-500 bg-red-50/20' : ''}`}
                />
                {printerErrors?.model_toner && (
                    <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {String(printerErrors.model_toner.message)}
                    </p>
                )}
            </div>

            {/* Checkbox de Color */}
            <div className="flex items-center space-x-4 md:pt-8">
                <Controller
                    name="printer.color"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="is-color"
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                                className="border-zinc-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label
                                htmlFor="is-color"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                {t("eq_printer_label_color_question")}
                            </Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};