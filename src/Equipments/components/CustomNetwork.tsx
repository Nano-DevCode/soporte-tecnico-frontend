/* eslint-disable @typescript-eslint/no-explicit-any */
// components/equipment/NetworkFields.tsx
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CatalogSelector } from "../hooks/useCatalogs";
// Hook de Catálogo de Red
import { useNetworkTypes } from "../hooks/use-equipment-catalog";

interface NetworkFieldsProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    disabled: boolean;
}

export const NetworkFields = ({ control, register, disabled}: NetworkFieldsProps) => {
    // 1. Instanciamos el hook
    const networkHook = useNetworkTypes();

    return (
        <div className="mt-6 p-6 border border-orange-200 rounded-xl bg-orange-200/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold flex items-center gap-2 border-b border-orange-200 pb-2">
                <Network size={18} className="text-orange-600" /> Especificaciones de Red
            </h3>

            {/* Tipo de Red (LAN, WLAN, VPN, etc.) */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Tipo de Red <span className="text-red-600">*</span></Label>
                <Controller
                    name="network.id_type_equipment_network"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={networkHook}
                            // AJUSTE: Si field.value es string, creamos el objeto mínimo. 
                            // Si ya es un objeto (porque viene de la edición), lo pasamos tal cual.
                            value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
                            // AJUSTE: Pasamos el objeto completo al form state
                            onChange={(val) => field.onChange(val)}
                            disabled={disabled}
                            placeholder="Seleccionar tipo..."
                        />
                    )}
                />
            </div>

            {/* Número de Puertos */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ">Número de Puertos <span className="text-red-600">*</span></Label>
                <Input
                    type="number"
                    {...register("network.number_ports", { valueAsNumber: true })}
                    placeholder="Ej. 24"
                    disabled={disabled}
                    className="bg-white border-zinc-300 focus:ring-orange-500"
                />
            </div>

            {/* PoE Checkbox */}
            <div className="flex items-center space-x-4">
                <Controller
                    name="network.PoE"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-5">
                            <Label 
                                htmlFor="is-poe" 
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                ¿Tiene función PoE (Power over Ethernet)?
                            </Label>
                            <Checkbox
                                id="is-poe"
                                // Aseguramos que el valor sea booleano para el componente Checkbox
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
