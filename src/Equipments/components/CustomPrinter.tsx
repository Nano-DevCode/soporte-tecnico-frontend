// components/equipment/PrinterFields.tsx
import { Label } from "@/components/ui/label";
import { AlertCircle, Printer } from "lucide-react";
import { Controller, type Control, type UseFormRegister, type UseFormSetValue, type FieldValues, type FieldErrors, type FieldError } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CatalogSelector } from "../hooks/useCatalogs";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

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
                loading: { title: "Creando función de impresora..." },
                success: {
                    title: "¡Función creada!",
                    description: `La función "${name}" se guardó correctamente.`,
                    duration: 4000
                },
                error: (err) => ({
                    title: "Error al crear",
                    description: getBackendErrorMessage(err, "No se pudo crear la función."),
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
                loading: { title: "Creando tipo de impresión..." },
                success: {
                    title: "¡Tipo de impresión creado!",
                    description: `El tipo "${name}" se guardó correctamente.`,
                    duration: 4000
                },
                error: (err) => ({
                    title: "Error al crear",
                    description: getBackendErrorMessage(err, "No se pudo crear el tipo de impresión."),
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
                <Printer size={18} className="text-purple-600" /> Especificaciones de Impresora
            </h3>

            {/* Función de Impresora */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Función <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_function"
                    control={control}
                    rules={{ required: "La función de la impresora es obligatoria" }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={functionsHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Seleccionar función (Multifuncional...)"
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
                <Label className="text-xs font-bold uppercase">Tipo de Impresión <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_printing"
                    control={control}
                    rules={{ required: "El tipo de impresión es obligatorio" }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typesHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Inyección, Térmica, Láser..."
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
                <Label className="text-xs font-bold uppercase">Modelo de Tóner / Cartucho</Label>
                <Input
                    {...register("printer.model_toner",
                        {
                            required: "Este campo es requerido",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            maxLength: { value: 150, message: "Máximo 150 caracteres" }
                        })}
                    disabled={disabled}
                    className={`bg-slate-50/50 border-zinc-300 focus:ring-0 ${printerErrors?.model_toner ? 'border-red-500 bg-red-50/20' : ''}`}
                />
                {printerErrors?.model_toner && (
                    <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {String(printerErrors.model_toner.message)}
                    </p>
                )}
            </div>

            {/* Checkbox de Color (Opcional - Sin validación requerida) */}
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
                                ¿Imprime a Color?
                            </Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
