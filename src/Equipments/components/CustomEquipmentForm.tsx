import { useState } from "react";
import { useForm, useWatch, Controller, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, PlusCircle, AlertCircle, X, Server, Edit } from "lucide-react";

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
import type { BackendError } from "@/interfaces/backendError.interfaces";

// IMPORTACIÓN DEL MANEJADOR DE ERRORES DEL BACKEND
import { handleBackendFormErrorsEq } from "../utils/backendFormHandlers";

interface Props {
    mode: "create" | "update";
    onSubmit: (data: FieldValues) => Promise<void>;
    isSubmitting: boolean;
    initialData?: FieldValues | undefined;
}

export const EquipmentForm = ({ mode, onSubmit, isSubmitting, initialData }: Props) => {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);
    const navigate = useNavigate();
    const isReadOnly = initialData?.status === false;

    const { control, register, setValue, handleSubmit, setError, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            id_type_equipment: initialData?.id_type_equipment
                ? { id: initialData.id_type_equipment.id, name: initialData.id_type_equipment.name }
                : undefined,
            num_inventario: initialData?.num_inventario ?? "",
            id_brand: initialData?.id_model?.id_brand
                ? { id: initialData.id_model.id_brand.id, name: initialData.id_model.id_brand.name }
                : undefined,
            id_model: initialData?.id_model
                ? { id: initialData.id_model.id, name: initialData.id_model.name }
                : undefined,
            id_responsable: initialData?.id_responsable
                ? {
                    id: initialData.id_responsable.id,
                    name: initialData.id_responsable.full_name ||
                        `${initialData.id_responsable.name || ''} ${initialData.id_responsable.first_name || ''} ${initialData.id_responsable.last_name || ''}`.trim()
                }
                : undefined,
            id_departament: initialData?.id_departament
                ? { id: initialData.id_departament.id, name: initialData.id_departament.name }
                : undefined,
            description: initialData?.description ?? "",
            computer: initialData?.computer ? {
                ...initialData.computer,
                id_processor: initialData.computer.id_processor
                    ? { id: initialData.computer.id_processor.id, name: initialData.computer.id_processor.brand + ' ' + initialData.computer.id_processor.model + ' ' + initialData.computer.id_processor.description } : undefined,
                id_type_operating_system: initialData.computer.id_type_operating_system
                    ? { id: initialData.computer.id_type_operating_system.id, name: initialData.computer.id_type_operating_system.name } : undefined,
                id_type_storage: initialData.computer.id_type_storage
                    ? { id: initialData.computer.id_type_storage.id, name: initialData.computer.id_type_storage.name } : undefined,
                id_type_equipment_computer: initialData.computer.id_type_equipment_computer
                    ? { id: initialData.computer.id_type_equipment_computer.id, name: initialData.computer.id_type_equipment_computer.name } : undefined,
            } : {},
            printer: initialData?.printer ? {
                ...initialData.printer,
                id_type_function: initialData.printer.id_type_function
                    ? { id: initialData.printer.id_type_function.id, name: initialData.printer.id_type_function.name } : undefined,
                id_type_printing: initialData.printer.id_type_printing
                    ? { id: initialData.printer.id_type_printing.id, name: initialData.printer.id_type_printing.name } : undefined,
            } : {},
            network: initialData?.network ? {
                ...initialData.network,
                id_type_equipment_network: initialData.network.id_type_equipment_network
                    ? { id: initialData.network.id_type_equipment_network.id, name: initialData.network.id_type_equipment_network.name } : undefined,
            } : {}
        }
    });

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

    const getBackendErrorMessage = (err: unknown, defaultMsg: string): string => {
        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const msg = err.response.data.message;
            return Array.isArray(msg) ? msg.join(", ") : msg;
        }
        if (err instanceof Error) return err.message.replace(/^Error:\s*/i, "");
        if (typeof err === "string") return err;
        return defaultMsg;
    };

    // Handlers de Creación Rápida
    const handleCreateTypeEquipment = async (name: string) => {
        if (!name || name.trim() === "") {
            sileo.error({ title: "Campo vacío", description: "El nombre del tipo de equipo no puede contener solo espacios." });
            return;
        }
        try {
            const newItem = await sileo.promise(eqTypesHook.onCreate({ name: name.trim() }), {
                loading: { title: "Creando tipo de equipo..." },
                success: { title: "¡Tipo creado!", description: `El tipo "${name.trim()}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({
                    title: "Error al crear",
                    description: getBackendErrorMessage(err, "No se pudo crear el tipo."),
                    duration: 5000
                })
            });
            if (newItem) setValue("id_type_equipment", newItem, { shouldValidate: true });
        } catch (e) { console.error(e); }
    };

    const handleCreateBrand = async (name: string) => {
        if (!name || name.trim() === "") {
            sileo.error({ title: "Campo vacío", description: "El nombre de la marca no puede contener solo espacios." });
            return;
        }
        try {
            const newItem = await sileo.promise(brandsHook.onCreate({ name: name.trim() }), {
                loading: { title: "Creando marca..." },
                success: { title: "¡Marca creada!", description: `La marca "${name.trim()}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({
                    title: "Error al crear",
                    description: getBackendErrorMessage(err, "No se pudo crear la marca."),
                    duration: 5000
                })
            });
            if (newItem) {
                setValue("id_brand", newItem, { shouldValidate: true });
                setValue("id_model", undefined);
            }
        } catch (e) { console.error(e); }
    };

    const handleCreateModel = async (newModelName: string) => {
        if (!newModelName || newModelName.trim() === "") {
            sileo.error({ title: "Campo vacío", description: "El nombre del modelo no puede contener solo espacios." });
            return;
        }
        if (!selectedBrandId) {
            sileo.error({ title: "Error", description: "Debes seleccionar una marca primero." });
            return;
        }
        try {
            const newModelFromDB = await sileo.promise(modelsHook.onCreate({ name: newModelName.trim(), brandId: selectedBrandId }), {
                loading: { title: "Creando modelo..." },
                success: { title: "¡Modelo creado!", description: `El modelo "${newModelName.trim()}" se guardó correctamente.`, duration: 4000 },
                error: (err) => ({
                    title: "Error al crear",
                    description: getBackendErrorMessage(err, "No se pudo crear el modelo."),
                    duration: 5000
                })
            });
            if (newModelFromDB) setValue("id_model", newModelFromDB, { shouldValidate: true });
        } catch (error) { console.error(error); }
    };

    // INTERCEPTACIÓN REDISEÑADA PARA AMBOS CASOS (CREATE Y UPDATE)
    const onFormSubmit = async (data: FieldValues) => {
        const toId = (obj: string | { id: string } | undefined) =>
            (obj && typeof obj === 'object' && 'id' in obj ? obj.id : obj);

        const formattedData = {
            ...data,
            id_type_equipment: toId(data.id_type_equipment),
            id_model: toId(data.id_model),
            id_responsable: toId(data.id_responsable),
            id_departament: toId(data.id_departament),
            description: data.description ? data.description.trim() : "",

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

        delete (formattedData as Partial<FieldValues>).id_brand;

        if (formattedData.computer) {
            delete formattedData.computer.id;
            delete formattedData.computer.created_at;
            delete formattedData.computer.updated_at;
        }
        if (formattedData.printer) {
            delete formattedData.printer.id;
            delete formattedData.printer.created_at;
            delete formattedData.printer.updated_at;
        }
        if (formattedData.network) {
            delete formattedData.network.id;
            delete formattedData.network.created_at;
            delete formattedData.network.updated_at;
        }

        try {
            // Esperamos a que la página procese la acción asíncrona
            await onSubmit(formattedData);
            
            // Si todo sale bien en Create o Update, redirige al catálogo
            navigate("/equipments");
        } catch (error) {
            // El formulario intercepta el error aquí y pinta en rojo el input inválido (ej. num_inventario)
            handleBackendFormErrorsEq(error, setError);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            {isReadOnly && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3 text-red-800 animate-in fade-in duration-10">
                    <AlertCircle size={22} />
                    <div className="flex flex-col">
                        <span className="uppercase font-extrabold text-center">ACTUALMENTE ESTE EQUIPO ESTA INACTIVO</span>
                        <p className="text-xs font-medium">La edición ha sido deshabilitada</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                {mode === "update" ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                        <div className="flex h-12 w-12 shrink-0 justify-center rounded-lg bg-primary/10 text-primary items-center gap-4">
                            <Edit className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Editar Equipo - {initialData?.id_type_equipment?.name}</h1>
                            <p className="text-sm font-medium text-muted-foreground">Modifique los campos necesarios del equipo seleccionado.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                        <div className="flex h-12 w-12 shrink-0 justify-center rounded-lg bg-primary/10 text-primary items-center gap-4">
                            <Server className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Equipo</h1>
                            <p className="text-sm font-medium text-muted-foreground">Ingrese los datos para registrar un nuevo equipo.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Tipo de equipo<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_type_equipment"
                        control={control}
                        rules={{ required: "El tipo de equipo es obligatorio" }}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={eqTypesHook}
                                disabled={!!initialData || isReadOnly}
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                placeholder="Selecciona tipo..."
                                allowCreate={true}
                                onCreate={handleCreateTypeEquipment}
                            />
                        )}
                    />
                    {initialData && (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase mt-1">
                            <AlertCircle size={12} />
                            <span>El tipo de equipo no se puede modificar</span>
                        </div>
                    )}
                    {errors.id_type_equipment && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.id_type_equipment.message)}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Número de Inventario</Label>
                    <Input
                        {...register("num_inventario", {
                            required: "Este campo es requerido",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            maxLength: { value: 150, message: "Máximo 150 caracteres" }
                        })}
                        disabled={isReadOnly}
                        className={`bg-slate-50/50 border-zinc-300 focus:ring-0 ${errors.num_inventario ? 'border-red-500 bg-red-50/20' : ''}`}
                        placeholder="NUMERO-DE-INVENTARIO-1"
                    />
                    {errors.num_inventario && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.num_inventario?.message)}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Marca<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_brand"
                        control={control}
                        rules={{ required: "La marca es obligatoria" }}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={brandsHook}
                                value={field.value}
                                disabled={isReadOnly}
                                onChange={(val) => {
                                    field.onChange(val);
                                    setValue("id_model", undefined);
                                }}
                                placeholder="HP, Dell, Cisco..."
                                allowCreate={true}
                                onCreate={handleCreateBrand}
                            />
                        )}
                    />
                    {errors.id_brand && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.id_brand.message)}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Modelo<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_model"
                        control={control}
                        rules={{ required: "El modelo es obligatorio" }}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={modelsHook}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!selectedBrandId || isReadOnly}
                                placeholder={!selectedBrandId ? "Primero elige una marca" : "Selecciona modelo..."}
                                allowCreate={true}
                                onCreate={handleCreateModel}
                            />
                        )}
                    />
                    {errors.id_model && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.id_model.message)}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase tracking-wider">Responsable<span className="text-red-600">*</span></Label>
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-[12px] text-blue-600 font-bold flex items-center gap-1 uppercase"
                            disabled={isReadOnly}
                            onClick={() => setIsRespModalOpen(true)}
                        >
                            <PlusCircle size={14} /> Agregar
                        </Button>
                    </div>
                    <Controller
                        name="id_responsable"
                        control={control}
                        rules={{ required: "El responsable es obligatorio" }}
                        render={({ field }) => {
                            const selectedValue = field.value;
                            let displayValue = null;

                            if (selectedValue) {
                                if (typeof selectedValue === 'object') {
                                    displayValue = {
                                        id: selectedValue.id,
                                        name: selectedValue.name || `${selectedValue.name || ''} ${selectedValue.first_name || ''} ${selectedValue.last_name || ''} `.trim()
                                    };
                                } else {
                                    displayValue = { id: selectedValue, name: "" };
                                }
                            }

                            return (
                                <CatalogSelector
                                    hook={responsiblesHook}
                                    allowCreate={false}
                                    value={displayValue}
                                    onChange={field.onChange}
                                    disabled={isReadOnly}
                                    placeholder="Nombre del responsable..."
                                />
                            );
                        }}
                    />
                    {errors.id_responsable && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.id_responsable.message)}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Departamento<span className="text-red-600">*</span></Label>
                    <Controller
                        name="id_departament"
                        control={control}
                        rules={{ required: "El departamento es obligatorio" }}
                        render={({ field }) => (
                            <CatalogSelector
                                hook={departmentsHook}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isReadOnly}
                                placeholder="Sistemas, RH, etc ..."
                                allowCreate={false}
                            />
                        )}
                    />
                    {errors.id_departament && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.id_departament.message)}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {typeId === "1" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <ComputerFields control={control} register={register} setValue={setValue} disabled={isReadOnly} errors={errors} />
                    </div>
                )}
                {typeId === "3" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <PrinterFields control={control} register={register} setValue={setValue} disabled={isReadOnly} errors={errors} />
                    </div>
                )}
                {typeId === "2" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <NetworkFields control={control} register={register} setValue={setValue} disabled={isReadOnly} errors={errors} />
                    </div>
                )}

                <div className="space-y-5">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">Descripción / Notas Adicionales</Label>
                        <span className={`text-[12px] py-.1 px-5 rounded-sm font-bold uppercase ${["1", "2", "3"].includes(typeId) ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                            {["1", "2", "3"].includes(typeId) ? "Opcional" : "Obligatorio"}
                        </span>
                    </div>

                    <Textarea
                        {...register("description", {
                            required: !["1", "2", "3"].includes(typeId) ? "Este campo es requerido" : false,
                            validate: (value) => {
                                const isOptional = ["1", "2", "3"].includes(typeId);
                                const hasValue = value && value.trim() !== " ";

                                if (isOptional && !hasValue) return true;
                                if (!isOptional && !hasValue) {
                                    return "La descripción es obligatoria para este tipo de equipo";
                                }

                                if (value.length < 3) return "Mínimo 3 caracteres";
                                if (value.length > 500) return "Máximo 500 caracteres";

                                return true;
                            }
                        })}
                        placeholder="Especificaciones técnicas u observaciones..."
                        disabled={isReadOnly}
                        className={`min-h-100px resize-none ${errors.description ? 'border-red-500 bg-red-50/20' : 'border-zinc-300'}`}
                    />

                    {errors.description && (
                        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {String(errors.description.message)}
                        </p>
                    )}
                </div>
            </div>

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
                    const newResp = await sileo.promise(responsiblesHook.onCreate(data), {
                        loading: { title: "Creando responsable..." },
                        success: {
                            title: "¡Responsable creado!",
                            description: "El registro se vinculó correctamente al equipo.",
                            duration: 4000
                        },
                        error: (err) => {
                            const errorDesc = getBackendErrorMessage(err, "Revisa los datos del responsable e intenta de nuevo.");
                            return {
                                title: "Error al crear responsable",
                                description: errorDesc,
                                duration: 5000
                            };
                        }
                    });

                    if (newResp) {
                        const fullName = `${newResp.name} ${newResp.first_name} ${newResp.last_name} - Área: ${newResp.area || ""}`.trim();
                        setValue("id_responsable", {
                            id: newResp.id,
                            name: fullName
                        }, { shouldValidate: true });

                        responsiblesHook.setSelectedId(newResp.id);
                        setIsRespModalOpen(false);
                    }
                }}
            />
        </form>
    );
};
