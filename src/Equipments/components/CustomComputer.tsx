/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Controller, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Monitor, PlusCircle } from "lucide-react";
import { CatalogSelector } from "../hooks/useCatalogs";
import { CreateProcessorModal } from "./createProcessorDialog";
import {
    useProcessors,
    useOperatingSystems,
    useStorageTypes,
    useComputerTypes
} from "../hooks/use-equipment-catalog";

interface ComputerFieldsProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
}

export const ComputerFields = ({ control, register, setValue }: ComputerFieldsProps) => {
    const [isProcModalOpen, setIsProcModalOpen] = useState(false);

    const processorHook = useProcessors();
    const osHook = useOperatingSystems();
    const storageHook = useStorageTypes();
    const typeHook = useComputerTypes();

    return (
        <div className="mt-6 p-6 border border-blue-200 rounded-xl bg-blue-50/50 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold text-blue-700 flex items-center gap-2 border-b border-blue-200 pb-2">
                <Monitor size={18} className="text-blue-700" /> Especificaciones de Cómputo
            </h3>

            {/* Tipo de Equipo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Tipo de Equipo *</Label>
                <Controller
                    name="computer.id_type_equipment_computer"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typeHook}
                            value={typeHook.options.find((c: any) => c.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="Laptop, Desktop..."
                        />
                    )}
                />
            </div>

            {/* Procesador con botón de detalle exclusivo */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-slate-500">Procesador *</Label>
                    <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-[10px] text-blue-600 hover:text-blue-800 uppercase font-bold flex items-center gap-1"
                        onClick={() => setIsProcModalOpen(true)}
                    >
                        <PlusCircle size={12} /> Agregar un Procesador
                    </Button>
                </div>
                <Controller
                    name="computer.id_processor"
                    control={control}
                    render={({ field }) => {
                        // Concatenamos Brand + Model para que se vea bien en el selector
                        const selected = processorHook.options.find((p: any) => p.id === field.value);
                        const displayValue = selected ? {
                            id: selected.id,
                            name: `${selected.brand} ${selected.model} ${selected.description}`.trim()
                        } : null;

                        return (
                            <CatalogSelector
                                hook={processorHook}
                                value={displayValue}
                                onChange={(val) => field.onChange(val?.id)}
                                placeholder="Core i7, Ryzen 5..."
                            />
                        );
                    }}
                />
            </div>

            {/* Sistema Operativo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Sistema Operativo *</Label>
                <Controller
                    name="computer.id_type_operating_system"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={osHook}
                            value={osHook.options.find((o: any) => o.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="Windows 11, Pro..."
                        />
                    )}
                />
            </div>

            {/* Almacenamiento */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Tipo de Almacenamiento *</Label>
                <Controller
                    name="computer.id_type_storage"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={storageHook}
                            value={storageHook.options.find((s: any) => s.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="SSD, HDD..."
                        />
                    )}
                />
            </div>

            {/* RAM y Disco */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Memoria RAM</Label>
                <Input {...register("computer.ram")} placeholder="Ej. 16 GB" className="bg-white border-zinc-300" />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Capacidad Almacenamiento</Label>
                <Input {...register("computer.capacity_storage")} placeholder="Ej. 1 TB SSD" className="bg-white border-zinc-300" />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Espacio Disponible</Label>
                <Input {...register("computer.available_storage")} placeholder="Ej. 500 GB" className="bg-white border-zinc-300" />
            </div>

            {/* MODAL DETALLADO */}
            <CreateProcessorModal
                isOpen={isProcModalOpen}
                onClose={() => setIsProcModalOpen(false)}
                isSubmitting={processorHook.isCreating}
                onSave={async (data) => {
                    const newItem = await processorHook.onCreate(data);
                    if (newItem) {
                        setValue("computer.id_processor", newItem.id, { shouldValidate: true });
                    }
                }}
            />
        </div>
    );
};
