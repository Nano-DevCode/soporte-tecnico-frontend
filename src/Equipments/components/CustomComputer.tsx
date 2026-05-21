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
                loading: { title: "Creando tipo de computadora..." },
                success: { title: "¡Tipo creado!", description: `El tipo "${name}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({ title: "Error al crear", description: getBackendErrorMessage(err, "No se pudo crear el tipo."), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_equipment_computer", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateOS = async (name: string) => {
        try {
            const newItem = await sileo.promise(osHook.onCreate({ name: name.trim() }), {
                loading: { title: "Creando sistema operativo..." },
                success: { title: "¡S.O. creado!", description: `El S.O. "${name}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({ title: "Error al crear", description: getBackendErrorMessage(err, "No se pudo crear el sistema operativo."), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_operating_system", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateStorage = async (name: string) => {
        try {
            const newItem = await sileo.promise(storageHook.onCreate({ name: name.trim() }), {
                loading: { title: "Creando tipo de almacenamiento..." },
                success: { title: "¡Almacenamiento creado!", description: `El almacenamiento "${name}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({ title: "Error al crear", description: getBackendErrorMessage(err, "No se pudo crear el tipo de almacenamiento."), duration: 5000 })
            });
            if (newItem) setValue("computer.id_type_storage", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateProcessor = async (data: Record<string, string>) => {
        
            const newItem = await sileo.promise(processorHookInstance.onCreate(data), {
                loading: { title: "Registrando procesador..." },
                success: { title: "¡Procesador registrado!", description: `${data.brand} ${data.model} se añadió correctamente.`, duration: 4000 },
                // Sileo ahora absorbe y parsea correctamente el error del backend del procesador
                error: (err) => ({ title: "Error en el guardado", description: getBackendErrorMessage(err, "No se pudo registrar el procesador."), duration: 5000 })
            });

            if (newItem) {
                const fullName = `${newItem.brand} ${newItem.model} ${newItem.description || ""}`.trim();

                setValue("computer.id_processor", {
                    id: newItem.id,
                    name: fullName
                }, { shouldValidate: true });

                processorHookInstance.setSelectedId(newItem.id);
                setIsProcessorModalOpen(false);
            }
    };


    // Helper rápido para obtener los errores anidados de la propiedad computer
    const computerErrors = errors?.computer as Record<string, FieldError> | undefined;

    return (
        <div className="mt-6 p-6 border border-blue-200 rounded-xl bg-blue-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-blue-200 pb-2">
                <Monitor size={18} className="text-blue-700" /> Especificaciones de Computadora
            </h3>

            {/* Tipo de Equipo */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Tipo de Equipo <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_equipment_computer"
                    control={control}
                    rules={{ required: "El tipo de equipo es obligatorio" }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={typeHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            disabled={disabled}
                            onChange={(val) => field.onChange(val)}
                            placeholder="Laptop, Desktop..."
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
                    <Label className="text-xs font-bold uppercase">Procesador <span className="text-red-600">*</span></Label>
                    <Button
                        type="button"
                        variant="link"
                        disabled={disabled}
                        className="h-auto p-0 text-[12px] text-blue-600 hover:text-blue-800 uppercase font-bold flex items-center gap-1"
                        onClick={() => setIsProcessorModalOpen(true)}
                    >
                        <PlusCircle size={12} /> Agregar
                    </Button>
                </div>
                <Controller
                    name="computer.id_processor"
                    control={control}
                    rules={{ required: "El procesador es obligatorio" }}
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
                                placeholder="Seleccione un procesador..."
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
                <Label className="text-xs font-bold uppercase">Sistema Operativo <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_operating_system"
                    control={control}
                    rules={{ required: "El sistema operativo es obligatorio" }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={osHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Windows 11, Pro..."
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
                <Label className="text-xs font-bold uppercase">Tipo de Almacenamiento <span className="text-red-600">*</span></Label>
                <Controller
                    name="computer.id_type_storage"
                    control={control}
                    rules={{ required: "El tipo de almacenamiento es obligatorio" }}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={storageHook}
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="SSD, HDD..."
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
                <Label className="text-xs font-bold uppercase">Capacidad de Memoria RAM (GB) <span className="text-red-600">*</span></Label>
                <Input 
                    {...register("computer.ram", { 
                        required: "La memoria RAM es obligatoria",
                        min: { value: 1, message: "Debe ser mayor a 0" }
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
                <Label className="text-xs font-bold uppercase">Capacidad de Almacenamiento en Disco (GB) <span className="text-red-600">*</span></Label>
                <Input 
                    {...register("computer.capacity_storage", { 
                        required: "La capacidad de almacenamiento es obligatoria",
                        min: { value: 1, message: "Debe ser mayor a 0" }
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
                <Label className="text-xs font-bold uppercase">Espacio Disponible en Disco (GB) <span className="text-red-600">*</span></Label>
                <Input 
                    {...register("computer.available_storage", { 
                        required: "El espacio disponible es obligatorio",
                        min: { value: 0, message: "No puede ser un valor negativo" }
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

            {/* MODAL DETALLADO DE PROCESADOR ENVOLVIENDO CON SILEO */}
            <CreateProcessorModal
                isOpen={isProcessorModalOpen}
                onClose={() => setIsProcessorModalOpen(false)}
                isSubmitting={processorHookInstance.isCreating}
                onSave={handleCreateProcessor}
            />
        </div>
    );
};
