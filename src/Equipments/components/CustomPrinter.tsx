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
}

export const PrinterFields = ({ control, register }: PrinterFieldsProps) => {
    // 1. Instanciamos los hooks (el factory maneja estados internos)
    const functionsHook = usePrinterFunctions();
    const typesHook = usePrintingTypes();

    return (
        <div className="mt-6 p-6 border border-purple-200 rounded-xl bg-purple-100/50 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold text-purple-700 flex items-center gap-2 border-b border-purple-200 pb-2">
                <Printer size={18} className="text-purple-600" /> Detalles de Impresión
            </h3>

            {/* Función de Impresora (Multifuncional, Láser, etc.) */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Función *</Label>
                <Controller
                    name="printer.id_type_function"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={functionsHook}
                            value={functionsHook.options.find((f: any) => f.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="Seleccionar función..."
                        />
                    )}
                />
            </div>

            {/* Tecnología de Impresión */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Tecnología de Impresión *</Label>
                <Controller
                    name="printer.id_type_printing"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typesHook}
                            value={typesHook.options.find((t: any) => t.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="Inyección, Térmica..."
                        />
                    )}
                />
            </div>

            {/* Modelo de Tóner */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Modelo de Tóner / Cartucho</Label>
                <Input
                    {...register("printer.model_toner")}
                    placeholder="Ej. HP 85A"
                    className="bg-white border-zinc-300 focus:ring-green-500"
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
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-zinc-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <Label
                                htmlFor="is-color"
                                className="text-sm font-medium leading-none cursor-pointer text-slate-700"
                            >
                                ¿Impresión a Color?
                            </Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};