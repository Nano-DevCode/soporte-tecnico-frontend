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
    disabled?: boolean;
}

export const ComputerFields = ({ control, register, setValue, disabled }: ComputerFieldsProps) => {
    const [isProcModalOpen, setIsProcModalOpen] = useState(false);
        // const isReadOnly = initialData?.status === false;
    const processorHook = useProcessors();
    const osHook = useOperatingSystems();
    const storageHook = useStorageTypes();
    const typeHook = useComputerTypes();

    return (
        <div className="mt-6 p-6 border border-blue-200 rounded-xl bg-blue-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold  flex items-center gap-2 border-b border-blue-200 pb-2">
                <Monitor size={18} className="text-blue-700" /> Especificaciones de Computadora
            </h3>

            {/* Tipo de Equipo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Tipo de Equipo <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_equipment_computer"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typeHook}
                            // CAMBIO: Si el valor es un string (UUID), lo envolvemos. 
                            // Si ya es un objeto (porque viene de initialData), lo pasamos directo.
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            disabled={disabled}
                            onChange={(val) => field.onChange(val)} // Pasamos el objeto completo para mantener consistencia
                            placeholder="Laptop, Desktop..."
                        />
                    )}
                />
            </div>

            {/* Procesador */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase ">Procesador <span className="text-red-600">*</span></Label>
                    <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-[12px] text-blue-600 hover:text-blue-800 uppercase font-bold flex items-center gap-1"
                        onClick={() => setIsProcModalOpen(true)}
                    >
                        <PlusCircle size={12} /> Agregar
                    </Button>
                </div>

                <Controller
                    name="computer.id_processor"
                    control={control}
                    render={({ field }) => {
                        // Definimos el valor que se le pasará al selector
                        let displayValue = null;

                        if (field.value) {
                            if (typeof field.value === 'object') {
                                // Si ya es un objeto, nos aseguramos de que tenga el 'name' formateado
                                // usando las propiedades que vienen del backend (brand, model)
                                displayValue = {
                                    id: field.value.id,
                                    name: field.value.name ||
                                        `${field.value.brand || ''} ${field.value.model} ${field.value.description || ''}`.trim()
                                };
                            } else {
                                // Si es solo el ID (string), mandamos el objeto con nombre vacío
                                // para que el CatalogSelector lo hidrate automáticamente
                                displayValue = { id: field.value, name: "" };
                            }
                        }

                        return (
                            <CatalogSelector
                                hook={processorHook}
                                value={displayValue}
                                onChange={(val) => {
                                    // Guardamos el objeto completo en el formulario para que 
                                    // el nombre esté disponible inmediatamente sin esperar al backend
                                    field.onChange(val);
                                }}
                                disabled={disabled}
                                placeholder="Seleccione un procesador..."
                            />
                        );
                    }}
                />
            </div>

            {/* Sistema Operativo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Sistema Operativo <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_operating_system"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={osHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Windows 11, Pro..."
                        />
                    )}
                />
            </div>

            {/* Almacenamiento */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Tipo de Almacenamiento <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_storage"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={storageHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="SSD, HDD..."
                        />
                    )}
                />
            </div>

            {/* RAM y Disco */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Memoria RAM <span className="text-red-600">*</span></Label>
                <Input {...register("computer.ram")} disabled={disabled} placeholder="Ej. 16 GB" className="bg-white border-zinc-300" />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Capacidad Almacenamiento<span className="text-red-600">*</span></Label>
                <Input {...register("computer.capacity_storage")}  disabled={disabled} placeholder="Ej. 1 TB SSD" className="bg-white border-zinc-300" />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Espacio Disponible<span className="text-red-600">*</span></Label>
                <Input {...register("computer.available_storage")} disabled={disabled} placeholder="Ej. 500 GB" className="bg-white border-zinc-300" />
            </div>

            {/* MODAL DETALLADO */}
            <CreateProcessorModal
                isOpen={isProcModalOpen}
                onClose={() => setIsProcModalOpen(false)}
                isSubmitting={processorHook.isCreating}
                onSave={async (data) => {
                    const newItem = await processorHook.onCreate(data);
                    if (newItem) {
                        // Al crear uno nuevo, pasamos el objeto completo para que el selector lo muestre de inmediato
                        setValue("computer.id_processor", newItem, { shouldValidate: true });
                    }
                }}
            />
        </div>
    );
};
