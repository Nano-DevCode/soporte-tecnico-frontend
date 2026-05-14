/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CatalogSelector } from "../hooks/useCatalogs";

// Hooks de Catálogos simplificados
import {
    usePrinterFunctions,
    usePrintingTypes
} from "../hooks/use-equipment-catalog";

interface PrinterFieldsProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    disabled:boolean;
}

export const PrinterFields = ({ control, register , disabled}: PrinterFieldsProps) => {
    // 1. Instanciamos los hooks
    const functionsHook = usePrinterFunctions();
    const typesHook = usePrintingTypes();

    return (
        <div className="mt-6 p-6 border border-purple-200 rounded-xl bg-purple-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-purple-200 pb-3">
                <Printer size={18} className="text-purple-600" /> Especificaciones de Impresora
            </h3>

            {/* Función de Impresora (Multifuncional, Láser, etc.) */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Función <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_function"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={functionsHook}
                            // AJUSTE: Soporta tanto el string (ID) como el objeto completo para edición
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            // AJUSTE: Guardamos el objeto completo en el form state
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Seleccionar función..."
                        />
                    )}
                />
            </div>

            {/* Tecnología de Impresión */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Tipo de Impresión <span className="text-red-600">*</span></Label>
                <Controller
                    name="printer.id_type_printing"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typesHook}
                            // AJUSTE: Misma lógica para hidratación correcta
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Inyección, Térmica..."
                        />
                    )}
                />
            </div>

            {/* Modelo de Tóner */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Modelo de Tóner / Cartucho</Label>
                <Input
                    {...register("printer.model_toner")}
                    disabled={disabled}
                    placeholder="Ej. HP 85A"
                    className="bg-white border-zinc-300 focus:ring-purple-500"
                />
            </div>

            {/* Checkbox de Color */}
            <div className="flex items-center gap-3 md:pt-8">
                <Controller
                    name="printer.color"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is-color"
                                // Aseguramos un valor booleano puro
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                                className="border-zinc-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label
                                htmlFor="is-color"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                ¿Imprime a color  a Color?
                            </Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
