/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, PlusCircle, AlertCircle, X } from "lucide-react";

// Custom Components & Hooks
import { CatalogSelector } from "../hooks/useCatalogs";
import { ComputerFields } from "./CustomComputer";
import { PrinterFields } from "./CustomPrinter";
import { NetworkFields } from "./CustomNetwork";
import { CreateResponsibleModal } from "./createResponsibleDialog";
import {
    useEquipmentTypes,
    useBrands,
    useModels,
    useResponsibles,
    useDepartments
} from "../hooks/use-equipment-catalog";
interface Props {
    mode: "create" | "update";
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    initialData?: any;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const EquipmentForm = ({ mode, onSubmit, isSubmitting, initialData }: Props) => {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);
    const navigate = useNavigate();
    const isReadOnly = initialData?.status === false;

    // 1. HIDRATACIÓN INICIAL
    const { control, register, setValue, handleSubmit } = useForm<any>({
        defaultValues: {
            id_type_equipment: initialData?.id_type_equipment
                ? { id: initialData.id_type_equipment.id, name: initialData.id_type_equipment.name }
                : null,
            num_inventario: initialData?.num_inventario ?? "",
            id_brand: initialData?.id_model?.id_brand
                ? { id: initialData.id_model.id_brand.id, name: initialData.id_model.id_brand.name }
                : null,
            id_model: initialData?.id_model
                ? { id: initialData.id_model.id, name: initialData.id_model.name }
                : null,
            id_responsable: initialData?.id_responsable
                ? {
                    id: initialData.id_responsable.id,
                    name: initialData.id_responsable.full_name ||
                        `${initialData.id_responsable.name || ''} ${initialData.id_responsable.first_name || ''} ${initialData.id_responsable.last_name || ''}`.trim()
                }
                : null,
            id_departament: initialData?.id_departament
                ? { id: initialData.id_departament.id, name: initialData.id_departament.name }
                : null,
            description: initialData?.description ?? "",
            computer: initialData?.computer ? {
                ...initialData.computer,
                id_processor: initialData.computer.id_processor
                    ? { id: initialData.computer.id_processor.id, name: initialData.computer.id_processor.brand + ' ' + initialData.computer.id_processor.model + ' ' + initialData.computer.id_processor.description } : null,
                id_type_operating_system: initialData.computer.id_type_operating_system
                    ? { id: initialData.computer.id_type_operating_system.id, name: initialData.computer.id_type_operating_system.name } : null,
                id_type_storage: initialData.computer.id_type_storage
                    ? { id: initialData.computer.id_type_storage.id, name: initialData.computer.id_type_storage.name } : null,
                id_type_equipment_computer: initialData.computer.id_type_equipment_computer
                    ? { id: initialData.computer.id_type_equipment_computer.id, name: initialData.computer.id_type_equipment_computer.name } : null,
            } : {},
            printer: initialData?.printer ? {
                ...initialData.printer,
                id_type_function: initialData.printer.id_type_function
                    ? { id: initialData.printer.id_type_function.id, name: initialData.printer.id_type_function.name } : null,
                id_type_printing: initialData.printer.id_type_printing
                    ? { id: initialData.printer.id_type_printing.id, name: initialData.printer.id_type_printing.name } : null,
            } : {},
            network: initialData?.network ? {
                ...initialData.network,
                id_type_equipment_network: initialData.network.id_type_equipment_network
                    ? { id: initialData.network.id_type_equipment_network.id, name: initialData.network.id_type_equipment_network.name } : null,
            } : {}
        }

    }
    );

    // Hooks de Catálogos
    const eqTypesHook = useEquipmentTypes();
    const brandsHook = useBrands();
    const responsiblesHook = useResponsibles();
    const departmentsHook = useDepartments();

    // Observadores
    const watchedBrand = useWatch({ control, name: "id_brand" });
    const selectedBrandId = watchedBrand?.id;
    const watchedType = useWatch({ control, name: "id_type_equipment" });
    const typeId = String(watchedType?.id || "");

    const modelsHook = useModels(selectedBrandId);

    // 2. FUNCIÓN DE TRANSFORMACIÓN (Limpia objetos para el Backend)
    const onFormSubmit = (data: any) => {
        const toId = (obj: any) => (obj && typeof obj === 'object' && 'id' in obj ? obj.id : obj);

        const formattedData = {
            ...data,
            id_type_equipment: toId(data.id_type_equipment),
            id_model: toId(data.id_model),
            id_responsable: toId(data.id_responsable),
            id_departament: toId(data.id_departament),

            // AJUSTE AQUÍ: Limpieza profunda de sub-objetos
            computer: data.computer && Object.keys(data.computer).length > 0 ? {
                ...data.computer,
                id_processor: toId(data.computer.id_processor),
                id_type_operating_system: toId(data.computer.id_type_operating_system),
                id_type_storage: toId(data.computer.id_type_storage),
                id_type_equipment_computer: toId(data.computer.id_type_equipment_computer),
            } : undefined,

            printer: data.printer && Object.keys(data.printer).length > 0 ? {
                ...data.printer,
                id_type_function: toId(data.printer.id_type_function),
                id_type_printing: toId(data.printer.id_type_printing),
            } : undefined,

            network: data.network && Object.keys(data.network).length > 0 ? {
                ...data.network,
                id_type_equipment_network: toId(data.network.id_type_equipment_network),
            } : undefined
        };

        // --- ELIMINAR PROPIEDADES PROHIBIDAS POR EL BACKEND ---
        // 1. Eliminar id_brand (solo UI)
        delete formattedData.id_brand;

        // 2. Limpiar el objeto computer de IDs y fechas internas
        if (formattedData.computer) {
            delete formattedData.computer.id;
            delete formattedData.computer.created_at;
            delete formattedData.computer.updated_at;
        }

        // 3. Limpiar printer por si acaso
        if (formattedData.printer) {
            delete formattedData.printer.id;
            delete formattedData.printer.created_at;
            delete formattedData.printer.updated_at;
        }

        // 4. Limpiar network por si acaso
        if (formattedData.network) {
            delete formattedData.network.id;
            delete formattedData.network.created_at;
            delete formattedData.network.updated_at;
        }
        delete formattedData.id_brand;
        onSubmit(formattedData);
    };


    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6"
        >
            {isReadOnly && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3 text-red-800 animate-in fade-in duration-10">
                    <AlertCircle size={22} />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm uppercase font-extrabold text-center">ACTUALMENTE ESTE EQUIPO ESTA INACTIVO</span>
                        <p className="text-xs font-medium">La edición ha sido deshabilitada</p>
                    </div>
                </div>
            )}
            {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Tipo de equipo<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_type_equipment"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={eqTypesHook}
                                disabled={!!initialData || isReadOnly}
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                placeholder="Selecciona tipo..."
                            />
                        )}
                    />
                    {initialData && (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase mt-1">
                            <AlertCircle size={12} />
                            <span>El tipo de equipo no se puede modificar</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Número de Inventario</Label>
                    <Input
                        {...register("num_inventario")}
                        disabled={isReadOnly}
                        className="bg-slate-50/50 border-zinc-300 focus:ring-0"
                    />
                </div>
            </div>

            {/* SECCIÓN 2: MARCA Y MODELO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Marca<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_brand"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={brandsHook}
                                value={field.value}
                                disabled={isReadOnly}
                                onChange={(val) => {
                                    field.onChange(val);
                                    setValue("id_model", null);
                                }}
                                placeholder="HP, Dell, Cisco..."
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Modelo<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_model"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={modelsHook}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!selectedBrandId || isReadOnly}
                                placeholder={!selectedBrandId ? "Primero elige una marca" : "Selecciona modelo..."}
                            />
                        )}
                    />
                </div>
            </div>

            {/* SECCIÓN 3: ASIGNACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Responsable<span className="text-red-600">*</span></Label>
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-[12px] text-blue-600 font-bold flex items-center gap-1"
                            onClick={() => setIsRespModalOpen(true)}
                        >
                            <PlusCircle size={14} /> Agregar Nuevo
                        </Button>
                    </div>
                    <Controller
                        name="id_responsable"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={responsiblesHook}
                                allowCreate={false}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isReadOnly}
                                placeholder="Nombre del responsable..."
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Departamento<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_departament"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={departmentsHook}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isReadOnly}
                                placeholder="Sistemas, RH, Ventas..."
                            />
                        )}
                    />
                </div>
            </div>

            {/* RENDERIZADO DINÁMICO POR TIPO */}
            <div className="space-y-6">
                {typeId === "1" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <ComputerFields control={control} register={register} setValue={setValue} disabled={isReadOnly} />
                    </div>
                )}
                {typeId === "3" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <PrinterFields control={control} register={register} disabled={isReadOnly} />
                    </div>
                )}
                {typeId === "2" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <NetworkFields control={control} register={register} disabled={isReadOnly} />
                    </div>
                )}

                <div className="px-0 space-y-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción / Notas Adicionales</Label>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-blue-700">
                            {["1", "2", "3"].includes(typeId) ? "Opcional" : "Obligatorio"}
                        </span>
                    </div>
                    <Textarea
                        {...register("description")}
                        placeholder="Especificaciones técnicas u observaciones..."
                        disabled={isReadOnly}
                        className="min-h-[100px] bg-white border-zinc-300 resize-none"
                    />
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row justify-end pt-6 gap-3 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/equipments')}
                    disabled={isSubmitting || isReadOnly}
                    className="w-full sm:w-auto px-6 font-bold"
                >
                    <X size={18} className="mr-2" /> CANCELAR
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting || isReadOnly}
                    className="w-full sm:w-auto px-8 font-bold gap-2 bg-blue-700 hover:bg-blue-800 text-white"
                >
                    {isSubmitting ? "Guardando..." : (
                        <>
                            <Save size={18} />
                            {mode === "update" ? "ACTUALIZAR REGISTRO" : "REGISTRAR EQUIPO"}
                        </>
                    )}
                </Button>
            </div>

            <CreateResponsibleModal
                isOpen={isRespModalOpen}
                onClose={() => setIsRespModalOpen(false)}
                isSubmitting={responsiblesHook.isCreating}
                onSave={async (data) => {
                    const newResp = await responsiblesHook.onCreate(data);
                    if (newResp) setValue("id_responsable", newResp, { shouldValidate: true });
                }}
            />
        </form>
    );
};

// function cn(...classes: any[]) {
//     return classes.filter(Boolean).join(' ');
// }

// export const EquipmentForm = ({ mode, onSubmit, isSubmitting, initialData }: Props) => {
//     const [isRespModalOpen, setIsRespModalOpen] = useState(false);
//     const navigate = useNavigate();

//     // 1. HIDRATACIÓN INICIAL (Arquitectura basada en Tools)
//     // Extraemos los objetos anidados del backend para que los selectores muestren el nombre de inmediato
//     const { control, register, setValue, handleSubmit } = useForm({
//         defaultValues: {
//             id_type_equipment: initialData?.id_type_equipment
//                 ? { id: initialData.id_type_equipment.id, name: initialData.id_type_equipment.name }
//                 : null,
//             num_inventario: initialData?.num_inventario ?? "",
//             id_brand: initialData?.id_model?.id_brand
//                 ? { id: initialData.id_model.id_brand.id, name: initialData.id_model.id_brand.name }
//                 : null,
//             id_model: initialData?.id_model
//                 ? { id: initialData.id_model.id, name: initialData.id_model.name }
//                 : null,
//             id_responsable: initialData?.id_responsable
//                 ? {
//                     id: initialData.id_responsable.id,
//                     // Si el backend ya trae el nombre completo, úsalo, si no, ármalo
//                     name: initialData.id_responsable.full_name ||
//                         `${initialData.id_responsable.name || ''} ${initialData.id_responsable.first_name || ''} ${initialData.id_responsable.last_name || ''}`.trim()
//                 }
//                 : null,
//             id_departament: initialData?.id_departament
//                 ? { id: initialData.id_departament.id, name: initialData.id_departament.name }
//                 : null,
//             description: initialData?.description ?? "",
//             computer: initialData?.computer ? {
//                 ...initialData.computer,
//                 id_processor: initialData.computer.id_processor
//                     ? { id: initialData.computer.id_processor.id, name: initialData.computer.id_processor.brand + ' '+  initialData.computer.id_processor.model + ' '+  initialData.computer.id_processor.description  } : null,
//                 id_type_operating_system: initialData.computer.id_type_operating_system
//                     ? { id: initialData.computer.id_type_operating_system.id, name: initialData.computer.id_type_operating_system.name } : null,
//                 id_type_storage: initialData.computer.id_type_storage
//                     ? { id: initialData.computer.id_type_storage.id, name: initialData.computer.id_type_storage.name } : null,
//                 id_type_equipment_computer: initialData.computer.id_type_equipment_computer
//                     ? { id: initialData.computer.id_type_equipment_computer.id, name: initialData.computer.id_type_equipment_computer.name } : null,
//             } : {},

//             // Hidratación profunda para Printer
//             printer: initialData?.printer ? {
//                 ...initialData.printer,
//                 id_type_function: initialData.printer.id_type_function
//                     ? { id: initialData.printer.id_type_function.id, name: initialData.printer.id_type_function.name } : null,
//                 id_type_printing: initialData.printer.id_type_printing
//                     ? { id: initialData.printer.id_type_printing.id, name: initialData.printer.id_type_printing.name } : null,
//             } : {},

//             // Hidratación profunda para Network
//             network: initialData?.network ? {
//                 ...initialData.network,
//                 id_type_equipment_network: initialData.network.id_type_equipment_network
//                     ? { id: initialData.network.id_type_equipment_network.id, name: initialData.network.id_type_equipment_network.name } : null,
//             } : {}

//         }
//     });

//     // Hooks de Catálogos
//     const eqTypesHook = useEquipmentTypes();
//     const brandsHook = useBrands();
//     const responsiblesHook = useResponsibles();
//     const departmentsHook = useDepartments();

//     // Observadores de estado para lógica dependiente
//     const watchedBrand = useWatch({ control, name: "id_brand" });
//     const selectedBrandId = watchedBrand?.id;

//     const watchedType = useWatch({ control, name: "id_type_equipment" });
//     const typeId = String(watchedType?.id || "");

//     const modelsHook = useModels(selectedBrandId);

//     return (
//         <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6"
//         >
//             {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-5 ">
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Tipo de equipo<span className="text-red-600">*</span></Label>
//                     <Controller
//                         name="id_type_equipment"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={eqTypesHook}
//                                 disabled={!!initialData}
//                                 // AJUSTE: Si es string lo envolvemos, si no lo pasamos directo
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => field.onChange(val)}
//                                 placeholder="Selecciona tipo..."
//                             />
//                         )}
//                     />
//                     {initialData && (
//                         <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase mt-1">
//                             <AlertCircle size={12} />
//                             <span>El tipo de equipo no se puede modificar</span>
//                         </div>
//                     )}
//                 </div>
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                         Número de Inventario<span className="text-red-600">*</span>
//                     </Label>
//                     <Input
//                         {...register("num_inventario")}
//                         placeholder="Ej. TI-001"
//                         className="bg-slate-50/50 border-zinc-300"
//                     />
//                 </div>
//             </div>

//             {/* SECCIÓN 2: MARCA Y MODELO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                         Marca<span className="text-red-600">*</span>
//                     </Label>
//                     <Controller
//                         name="id_brand"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={brandsHook}
//                                 value={field.value}
//                                 onChange={(val) => {
//                                     field.onChange(val);
//                                     setValue("id_model", null); // Limpiar modelo al cambiar marca
//                                 }}
//                                 placeholder="HP, Dell, Cisco..."
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                         Modelo<span className="text-red-600">*</span>
//                     </Label>
//                     <Controller
//                         name="id_model"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={modelsHook}
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 disabled={!selectedBrandId}
//                                 placeholder={!selectedBrandId ? "Primero elige una marca" : "Selecciona modelo..."}
//                             />
//                         )}
//                     />
//                 </div>
//             </div>

//             {/* SECCIÓN 3: ASIGNACIÓN */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b ">
//                 <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                         <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                             Responsable<span className="text-red-600">*</span>
//                         </Label>
//                         <Button
//                             type="button"
//                             variant="link"
//                             className="h-auto p-0 text-[12px] text-blue-600 font-bold flex items-center gap-1 hover:no-underline"
//                             onClick={() => setIsRespModalOpen(true)}
//                         >
//                             <PlusCircle size={14} /> Agregar Nuevo
//                         </Button>
//                     </div>
//                     <Controller
//                         name="id_responsable"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={responsiblesHook}
//                                 allowCreate={false}
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 placeholder="Nombre del responsable..."
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                         Departamento<span className="text-red-600">*</span>
//                     </Label>
//                     <Controller
//                         name="id_departament"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={departmentsHook}
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 placeholder="Sistemas, RH, Ventas..."
//                             />
//                         )}
//                     />
//                 </div>
//             </div>

//             {/* RENDERIZADO DINÁMICO POR TIPO */}
//             <div className="space-y-6">
//                 {typeId === "1" && (
//                     <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                         <ComputerFields control={control} register={register} setValue={setValue} />
//                     </div>
//                 )}

//                 {typeId === "3" && (
//                     <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                         <PrinterFields control={control} register={register} />
//                     </div>
//                 )}

//                 {typeId === "2" && (
//                     <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                         <NetworkFields control={control} register={register} />
//                     </div>
//                 )}

//                 {/* DESCRIPCIÓN GENERAL (Notas) */}
//                 <div className="px-6 animate-in fade-in slide-in-from-top-2 space-y-10">
//                     <div className="flex items-center gap-2 mb-2">
//                         <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                             Descripción / Notas Adicionales<span className="text-red-600">*</span>
//                         </span>
//                         <span className={cn(
//                             "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
//                             ["1", "2", "3"].includes(typeId)
//                                 ? "bg-amber-50 text-blue-700"
//                                 : "bg-amber-50 text-red-700"
//                         )}>
//                             {["1", "2", "3"].includes(typeId) ? "Campo Opcional" : "Campo Obligatorio"}
//                         </span>
//                     </div>
//                     <Textarea
//                         {...register("description")}
//                         placeholder="Especificaciones técnicas generales u observaciones..."
//                         className="min-h-100px bg-white border-zinc-300 resize-none"
//                     />
//                 </div>
//             </div>

//             {/* BOTONES DE ACCIÓN */}
//             <div className="flex flex-col sm:flex-row justify-end pt-6 gap-3 border-t border-border">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => navigate('/equipments')}
//                     disabled={isSubmitting}
//                     className="w-full sm:w-auto px-6 font-bold order-2 sm:order-1"
//                 >
//                     <X size={18} className="mr-2" /> CANCELAR
//                 </Button>

//                 <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full sm:w-auto px-8 font-bold gap-2 order-1 sm:order-2 bg-blue-700 hover:bg-blue-800 text-white"
//                 >
//                     {isSubmitting ? (
//                         <>Guardando...</>
//                     ) : (
//                         <>
//                             <Save size={18} />
//                             {mode === "update" ? "ACTUALIZAR REGISTRO" : "REGISTRAR EQUIPO"}
//                         </>
//                     )}
//                 </Button>
//             </div>

//             {/* MODAL PARA NUEVO RESPONSABLE */}
//             <CreateResponsibleModal
//                 isOpen={isRespModalOpen}
//                 onClose={() => setIsRespModalOpen(false)}
//                 isSubmitting={responsiblesHook.isCreating}
//                 onSave={async (data) => {
//                     const newResp = await responsiblesHook.onCreate(data);
//                     if (newResp) setValue("id_responsable", newResp, { shouldValidate: true });
//                 }}
//             />
//         </form>
//     );
// };

// // Función auxiliar para clases (si no tienes cn importado)
// function cn(...classes: unknown[]) {
//     return classes.filter(Boolean).join(' ');
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useEffect, useState } from "react";
// import { useForm, useWatch, Controller } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Save, PlusCircle, AlertCircle, X } from "lucide-react";
// import { useNavigate } from "react-router";
// import { CatalogSelector } from "../hooks/useCatalogs";
// import { ComputerFields } from "./CustomComputer";
// import { PrinterFields } from "./CustomPrinter";
// import { NetworkFields } from "./CustomNetwork";
// import { CreateResponsibleModal } from "./createResponsibleDialog";

// import {
//     useEquipmentTypes,
//     useBrands,
//     useModels,
//     useResponsibles,
//     useDepartments
// } from "../hooks/use-equipment-catalog";

// interface Props {
//     mode: "create" | "update";
//     onSubmit: (data: any) => void;
//     isSubmitting: boolean;
//     initialData?: any;
// }

// export const EquipmentForm = ({ onSubmit, isSubmitting, initialData }: Props) => {
//     const [isRespModalOpen, setIsRespModalOpen] = useState(false);
//     const navigate = useNavigate();
//     const { control, register, setValue, handleSubmit } = useForm({
//         // Usamos defaultValues para que la hidratación sea más estable
//         defaultValues: initialData || {
//             id_type_equipment: "",
//             num_inventario: "",
//             id_brand: "",
//             id_model: "",
//             id_responsable: "",
//             id_departament: "",
//             description: "",
//             computer: {},
//             printer: {},
//             network: {}
//         }
//     });

//     const eqTypesHook = useEquipmentTypes();
//     const brandsHook = useBrands();
//     const responsiblesHook = useResponsibles();
//     const departmentsHook = useDepartments();

//     // Importante: useWatch debe extraer el ID ya sea que el valor sea un string o un objeto
//     const watchedBrand = useWatch({ control, name: "id_brand" });
//     const selectedBrandId = typeof watchedBrand === 'object' ? watchedBrand?.id : watchedBrand;

//     const selectedTypeIdValue = useWatch({ control, name: "id_type_equipment" });
//     const selectedTypeId = typeof selectedTypeIdValue === 'object' ? selectedTypeIdValue?.id : selectedTypeIdValue;

//     const modelsHook = useModels(selectedBrandId);

//     const typeId = String(selectedTypeId || "");

//     useEffect(() => {
//         if (initialData) {
//             // Extraemos el modelo que viene del backend (anidado)
//             const modelData = initialData.id_model;

//             if (modelData && modelData.id_brand) {
//                 // 1. Seteamos la MARCA extrayéndola del modelo
//                 setValue("id_brand", {
//                     id: modelData.id_brand.id,
//                     name: modelData.id_brand.name
//                 });

//                 // 2. Seteamos el MODELO como objeto completo
//                 setValue("id_model", {
//                     id: modelData.id,
//                     name: modelData.name
//                 });
//             }

//             // Opcional: Si el responsable o departamento también se ven vacíos,
//             // puedes repetir la lógica aquí si el backend los envía como objetos.
//         }
//     }, [initialData, setValue]);

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card p-6 shadow-sm"
//         // onSubmit={handleSubmit(onSubmit)}
//         // className="space-y-8 p-6 rounded-2xl shadow-sm border"
//         >
//             {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-5">
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Tipo de equipo<span className="text-red-600">*</span></Label>
//                     <Controller
//                         name="id_type_equipment"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={eqTypesHook}
//                                 disabled={!!initialData}
//                                 // AJUSTE: Si es string lo envolvemos, si no lo pasamos directo
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => field.onChange(val)}
//                                 placeholder="Selecciona tipo..."
//                             />
//                         )}
//                     />
//                     {initialData && (
//                         <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase mt-1">
//                             <AlertCircle size={12} />
//                             <span>El tipo de equipo no se puede modificar</span>
//                         </div>
//                     )}
//                 </div>
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Número de Inventario<span className="text-red-600">*</span></Label>
//                     <Input
//                         {...register("num_inventario")}
//                         placeholder="Ej. TI-001"
//                         className="bg-slate-50 border-zinc-300"
//                     />
//                 </div>
//             </div>

//             {/* SECCIÓN 2: MARCA Y MODELO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-5">
//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Marca<span className="text-red-600">*</span></Label>
//                     <Controller
//                         name="id_brand"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={brandsHook}
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => {
//                                     field.onChange(val);
//                                     setValue("id_model", ""); // Limpiar modelo al cambiar marca
//                                 }}
//                                 placeholder="HP, Dell, Cisco..."
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Modelo<span className="text-red-600">*</span></Label>
//                     <Controller
//                         name="id_model"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={modelsHook}
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => field.onChange(val)}
//                                 disabled={!selectedBrandId}
//                                 placeholder={!selectedBrandId ? "Primero elige una marca" : "Selecciona modelo..."}
//                             />
//                         )}
//                     />
//                 </div>
//             </div>

//             {/* SECCIÓN 3: ASIGNACIÓN */}
//             <div className=" flex flex-col sm:flex-row grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-8">
//                 <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                         <Label className="text-xs font-bold uppercase ">Responsable<span className="text-red-600">*</span></Label>
//                         <Button
//                             type="button"
//                             variant="link"
//                             className="h-auto p-0 text-[12px] text-blue-600  font-bold flex flex-row items-center gap-1"
//                             onClick={() => setIsRespModalOpen(true)}
//                         >
//                             <PlusCircle size={16} /> Agregar
//                         </Button>
//                     </div>
//                     <Controller
//                         name="id_responsable"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={responsiblesHook}
//                                 allowCreate={false}
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => field.onChange(val)}
//                                 placeholder="Nombre del responsable..."
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase ">Departamento<span className="text-red-600">*</span></Label>
//                     <Controller
//                         name="id_departament"
//                         control={control}
//                         render={({ field }) => (
//                             <CatalogSelector
//                                 hook={departmentsHook}
//                                 value={typeof field.value === 'string' ? { id: field.value, name: "" } : field.value}
//                                 onChange={(val) => field.onChange(val)}
//                                 placeholder="Sistemas, RH, Ventas..."
//                             />
//                         )}
//                     />
//                 </div>
//             </div>

//             {/* RENDERIZADO DINÁMICO */}
//             {typeId === "1" && (
//                 <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                     <ComputerFields control={control} register={register} setValue={setValue} />
//                 </div>
//             )}

//             {typeId === "3" && (
//                 <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                     <PrinterFields control={control} register={register} />
//                 </div>
//             )}

//             {typeId === "2" && (
//                 <div className="animate-in fade-in slide-in-from-top-4 duration-300">
//                     <NetworkFields control={control} register={register} />
//                 </div>
//             )}
//             {!["1", "2", "3"].includes(typeId) && (
//                 < div className="space-y-2 animate-in fade-in slide-in-from-top-2" >
//                     <div className="flex items-center gap-2 text-slate-600 mb-2">
//                         <span className="text-sm font-bold uppercase">Descripción / Notas Adicionales<span className="text-red-600">*</span></span>
//                         <div className="border-amber-400 bg-amber-300 font-bold">Obligatorio</div>
//                     </div>
//                     <Textarea
//                         {...register("description")}
//                         placeholder="Especificaciones técnicas generales u observaciones..."
//                         className="min-h-120px bg-white border-zinc-300"
//                     />
//                 </div>)}

//             {["1", "2", "3"].includes(typeId) && (
//                 < div className="space-y-2 animate-in fade-in slide-in-from-top-2" >
//                     <div className="flex items-center gap-2 text-slate-600 mb-2">
//                         <span className="text-sm font-bold uppercase">Descripción / Notas Adicionales<span className="text-red-600">*</span></span>
//                         <div className="border-amber-400 bg-amber-300 font-bold">Es opcional </div>
//                     </div>
//                     <Textarea
//                         {...register("description")}
//                         placeholder="Especificaciones técnicas generales u observaciones..."
//                         className="min-h-120px bg-white border-zinc-300"
//                     />
//                 </div>)}
//             <div className="flex flex-col sm:flex-row justify-end pt-6 gap-4">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => navigate('/equipments')}
//                     disabled={isSubmitting}
//                     className="w-full sm:w-auto px-6 py-4 bg-neutral-50/50 rounded-se-sm  font-bold transition-all order-2 sm:order-1"
//                 >
//                     <X size={20} />
//                     CANCELAR
//                 </Button>

//                 <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full sm:w-auto px-6 py-4 rounded-se-sm font-bold gap-2 transition-all order-1 sm:order-2 flex items-center justify-center"
//                 >
//                     <Save size={20} />
//                     {isSubmitting
//                         ? "GUARDANDO..."
//                         : initialData ? "ACTUALIZAR REGISTRO" : "REGISTRAR EQUIPO"
//                     }
//                 </Button>
//             </div>

//             {/* MODAL RESPONSABLE */}
//             <CreateResponsibleModal
//                 isOpen={isRespModalOpen}
//                 onClose={() => setIsRespModalOpen(false)}
//                 isSubmitting={responsiblesHook.isCreating}
//                 onSave={async (data) => {
//                     const newResp = await responsiblesHook.onCreate(data);
//                     if (newResp) setValue("id_responsable", newResp, { shouldValidate: true });
//                 }}
//             />
//         </form >
//     );
// };
