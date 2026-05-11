/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, HardDrive, PlusCircle } from "lucide-react";

import { CatalogSelector } from "../hooks/useCatalogs";
import { ComputerFields } from "../components/CustomComputer";
import { PrinterFields } from "../components/CustomPrinter";
import { NetworkFields } from "../components/CustomNetwork";
import { CreateResponsibleModal } from "../components/createResponsibleDialog";

import {
    useEquipmentTypes,
    useBrands,
    useModels,
    useResponsibles,
    useDepartments
} from "../hooks/use-equipment-catalog";

interface Props {
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    initialData?: any;
}

export const EquipmentForm = ({ onSubmit, isSubmitting, initialData }: Props) => {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);

    // 1. Configuración de useForm usando 'values' para reaccionar a initialData automáticamente
    const { control, register, setValue, handleSubmit } = useForm({
        values: initialData || {
            id_type_equipment: "",
            num_inventario: "",
            id_brand: "",
            id_model: "",
            id_responsable: "",
            id_departament: "",
            description: "",
            computer: {},
            printer: {},
            network: {}
        }
    });

    // 2. Carga de Catálogos
    const eqTypesHook = useEquipmentTypes();
    const brandsHook = useBrands();
    const responsiblesHook = useResponsibles();
    const departmentsHook = useDepartments();

    // 3. Observadores de campos para lógica dinámica
    const selectedTypeId = useWatch({ control, name: "id_type_equipment" });
    const selectedBrandId = useWatch({ control, name: "id_brand" });
    const modelsHook = useModels(selectedBrandId);

    const typeId = String(selectedTypeId || "");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border"
        >

            {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Tipo de equipo</Label>
                    <Controller
                        name="id_type_equipment"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={eqTypesHook}
                                value={eqTypesHook.options.find((t: any) => String(t.id) === String(field.value)) || null}
                                onChange={(val) => field.onChange(val?.id)}
                                placeholder="Selecciona tipo..."
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Número de Inventario</Label>
                    <Input
                        {...register("num_inventario")}
                        placeholder="Ej. TI-001"
                        className="bg-slate-50 border-zinc-300"
                    />
                </div>
            </div>

            {/* SECCIÓN 2: MARCA Y MODELO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Marca</Label>
                    <Controller
                        name="id_brand"// pendeinte
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={brandsHook}
                                value={brandsHook.options.find((b: any) => String(b.id) === String(field.value)) || null}
                                onChange={(val) => {
                                    field.onChange(val?.id);
                                    setValue("id_model", ""); // Limpiar modelo al cambiar marca
                                }}
                                placeholder="HP, Dell, Cisco..."
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Modelo</Label>
                    <Controller
                        name="id_model"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={modelsHook}
                                value={modelsHook.options.find((m: any) => String(m.id) === String(field.value)) || null}
                                onChange={(val) => field.onChange(val?.id)}
                                disabled={!selectedBrandId}
                                placeholder={!selectedBrandId ? "Primero elige una marca" : "Selecciona modelo..."}
                            />
                        )}
                    />
                </div>
            </div>

            {/* SECCIÓN 3: ASIGNACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-8">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase text-slate-500">Responsable</Label>
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-[10px] text-blue-600 uppercase font-bold flex items-center gap-1"
                            onClick={() => setIsRespModalOpen(true)}
                        >
                            <PlusCircle size={12} /> Detallar Responsable
                        </Button>
                    </div>
                    <Controller
                        name="id_responsable"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={responsiblesHook}
                                allowCreate={false}
                                value={responsiblesHook.options.find((r: any) => String(r.id) === String(field.value)) || null}
                                onChange={(val) => field.onChange(val?.id)}
                                placeholder="Nombre del responsable..."
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Departamento</Label>
                    <Controller
                        name="id_departament"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={departmentsHook}
                                value={departmentsHook.options.find((d: any) => String(d.id) === String(field.value)) || null}
                                onChange={(val) => field.onChange(val?.id)}
                                placeholder="Sistemas, RH, Ventas..."
                            />
                        )}
                    />
                </div>
            </div>

            {/* --- RENDERIZADO DINÁMICO SEGÚN TIPO --- */}
            {typeId === "1" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <ComputerFields control={control} register={register} setValue={setValue} />
                </div>
            )}

            {typeId === "3" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <PrinterFields control={control} register={register} />
                </div>
            )}

            {typeId === "2" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <NetworkFields control={control} register={register} />
                </div>
            )}

            {/* Sección de Comentarios/Descripción (Visible para todos o genéricos) */}
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <HardDrive size={18} />
                    <span className="text-sm font-bold uppercase">Descripción / Notas Adicionales</span>
                </div>
                <Textarea
                    {...register("description")}
                    placeholder="Especificaciones técnicas generales u observaciones..."
                    className="min-h-120px bg-white border-zinc-300"
                />
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 px-8 py-6 rounded-xl font-bold gap-2 transition-all"
                >
                    <Save size={20} />
                    {isSubmitting
                        ? "GUARDANDO..."
                        : initialData ? "ACTUALIZAR REGISTRO" : "REGISTRAR EQUIPO"
                    }
                </Button>
            </div>

            {/* Modal para crear responsable sobre la marcha */}
            <CreateResponsibleModal
                isOpen={isRespModalOpen}
                onClose={() => setIsRespModalOpen(false)}
                isSubmitting={responsiblesHook.isCreating}
                onSave={async (data) => {
                    const newResp = await responsiblesHook.onCreate(data);
                    if (newResp) setValue("id_responsable", newResp.id);
                }}
            />
        </form>
    );
};