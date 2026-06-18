// components/CreateBatchForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle, Loader2, Image as ImageIcon, DollarSign, Layers, FileText, Minus, Plus, Info, X, Save } from "lucide-react";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateBatchProductPayload } from "../actions/post-batches-consumables.action";

interface Props {
    bagConsumables: Consumable[];
    isSubmitting: boolean;
    onSubmit: (data: CreateBatchProductPayload) => void;
    onRemoveItem: (id: string) => void;
    onCancel: () => void;
}

interface Consumable {
    id: string;
    imageUrl?: string | null;
    description?: string;
    item_code?: string;
    id_unit_measurement?: {
        id?: string | number;
        name?: string;
    } | null;
}

export const CreateBatchForm: React.FC<Props> = ({
    bagConsumables,
    isSubmitting,
    onSubmit,
    onRemoveItem,
    onCancel
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<CreateBatchProductPayload | null>(null);

    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateBatchProductPayload>({
        defaultValues: {
            num_requirement: "",
            items: [],
        }
    });

    const { fields, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = watch("items") || [];

    useEffect(() => {
        if (bagConsumables.length > 0) {
            const formItems = bagConsumables.map((c) => {
                const existingItem = watchedItems.find(item => item.id_consumable === c.id);
                return {
                    id_consumable: c.id,
                    arrival_amount: existingItem ? existingItem.arrival_amount : 1,
                    cost_batch: existingItem ? existingItem.cost_batch : 0,
                };
            });

            if (bagConsumables.length !== fields.length) {
                reset({ num_requirement: watch("num_requirement"), items: formItems });
            }
        } else {
            reset({ num_requirement: watch("num_requirement"), items: [] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bagConsumables, reset]);

    const getFullImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
            return url;
        }
        const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
        return `${backendBaseUrl}/${cleanUrl}`;
    };

    const handlePreSubmit = (data: CreateBatchProductPayload) => {
        setPendingData(data);
        setIsConfirmOpen(true);
    };

    return (
        <>
            <form onSubmit={handleSubmit(handlePreSubmit)} className="w-full space-y-6">

                {/* SECCIÓN DETALLE: Lista de Productos */}
                <div className="rounded-xl border-2 border-zinc-200/75 bg-card shadow-sm  w-full">
                    <div className=" flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60">
                        {/* Fila del Título y el Badge */}
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between space-y-4  w-full px-4">
                            {/* Contenedor vertical para el texto */}
                            <div className=" flex flex-col gap-1.5">
                                {/* Fila del Icono + Título */}
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                                        Consumibles seleccionados para ingreso
                                    </CardTitle>
                                </div>

                                {/* Descripción siempre abajo del título */}
                                <p className="text-sm text-muted-foreground">
                                    Asigna las unidades físicas que entraron a la bodega y su costo del lote de forma precisa.
                                </p>
                            </div>

                            {/* El Badge: Se queda a la derecha en pantallas grandes (sm:) o abajo en móvil */}
                            <span className=" w-fit bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40 shrink-0 self-start sm:self-center">
                                {fields.length} {fields.length === 1 ? "Consumible" : "Consumibles"}
                            </span>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        {/* NOTAS DE OPERACIÓN */}
                        <div className="px-4 border-b border-border/60 space-y-2 bg-muted/20 w-full mt-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground pt-3">
                                <Info size={14} className="text-orange-500 shrink-0" />
                                <span>Notas de Operación</span>
                            </div>
                            <ul className="space-y-2 p-2 text-sm text-muted-foreground leading-relaxed">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span>
                                        Si el consumible es <strong className="font-semibold text-foreground">fraccionario o unitario </strong>, ingresa la cantidad total que llego y el costo del lote.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Cabecera de Tabla para Desktop */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3  border-b border-border/60 text-xs uppercase font-bold tracking-wider items-center ">
                            <div className="md:col-span-6">Información del Consumible</div>
                            <div className="md:col-span-3 text-center">Cantidad Llegada</div>
                            <div className="md:col-span-2 text-center">Costo Lote</div>
                            <div className="md:col-span-1 text-center">Acciones</div>
                        </div>

                        <div className="divide-y divide-border/50">
                            {fields.map((field, index) => {
                                const consumableInfo = bagConsumables.find((c) => c.id === field.id_consumable);
                                const imgUrl = getFullImageUrl(consumableInfo?.imageUrl);
                                const itemErrors = errors.items?.[index];
                                const unitId = consumableInfo?.id_unit_measurement?.id;
                                const currentAmount = watchedItems[index]?.arrival_amount ?? 1;

                                return (
                                    <div
                                        key={field.id}
                                        className="p-5 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-stretch md:items-center transition-colors hover:bg-muted/[0.04]"
                                    >
                                        {/* Info Visual e Identificadores */}
                                        <div className="md:col-span-6 flex gap-3 items-center min-w-0">
                                            <div className="h-12 w-12 rounded-lg border border-border bg-background shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={consumableInfo?.description || "C  onsumable"}
                                                        className="h-full w-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="font-semibold text-sm text-foreground truncate" title={consumableInfo?.description}>
                                                    {consumableInfo?.description || "Cargando..."}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 items-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border/60">
                                                        {consumableInfo?.item_code || "---"}
                                                    </span>

                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${Number(unitId) === 1
                                                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40"
                                                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40"
                                                        }`}>
                                                        {consumableInfo?.id_unit_measurement?.name || "Unitario"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selector Numérico Avanzado */}
                                        <div className="md:col-span-3 space-y-1 md:space-y-0 flex flex-col items-start md:items-center">
                                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block md:hidden">
                                                Cantidad llegado
                                            </label>
                                            <div className={`flex items-center border rounded-lg overflow-hidden bg-background h-9 w-full max-w-[140px] shadow-sm ${itemErrors?.arrival_amount ? "border-destructive" : "border-input"
                                                }`}>
                                                <button
                                                    type="button"
                                                    className="px-2.5 h-full text-muted-foreground hover:bg-muted transition-colors border-r border-border"
                                                    onClick={() => setValue(`items.${index}.arrival_amount`, Math.max(1, currentAmount - 1), { shouldValidate: true })}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <input
                                                    type="number"
                                                    className="w-full text-center bg-transparent font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground"
                                                    {...register(`items.${index}.arrival_amount` as const, {
                                                        required: true,
                                                        valueAsNumber: true,
                                                        min: 1
                                                    })}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-2.5 h-full text-muted-foreground hover:bg-muted transition-colors border-l border-border"
                                                    onClick={() => setValue(`items.${index}.arrival_amount`, currentAmount + 1, { shouldValidate: true })}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Costo Lote */}
                                        <div className="md:col-span-2 space-y-1 md:space-y-0">
                                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block md:hidden">
                                                Costo lote ($)
                                            </label>
                                            <div className="relative w-full max-w-[140px] md:mx-auto">
                                                <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground/40" />
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`items.${index}.cost_batch` as const, {
                                                        required: "Requerido",
                                                        valueAsNumber: true,
                                                        validate: (value) => value > 0 || "Debe ser mayor a 0"
                                                    })}
                                                    className={`h-9 pl-6 text-right pr-2 focus-visible:ring-1 focus-visible:ring-blue-600 bg-background font-bold text-sm rounded-lg shadow-sm ${itemErrors?.cost_batch ? "border-destructive focus-visible:ring-destructive" : ""
                                                        }`}
                                                />
                                            </div>
                                            {itemErrors?.cost_batch && (
                                                <span className="text-[11px] font-medium text-destructive block text-left md:text-center mt-1">
                                                    {itemErrors.cost_batch.message}
                                                </span>
                                            )}
                                        </div>

                                        {/* Botón de Eliminación */}
                                        {/* Botón de Eliminación */}
                                        <div className="md:col-span-1 flex items-center justify-end md:justify-center mt-1 md:mt-0 pt-2 md:pt-0  border-border/40 md:border-none">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-8 w-auto md:w-8 hover:text-destructive rounded-lg flex items-center justify-center p-2 md:p-0 gap-2 transition-colors text-muted-foreground bg-transparent hover:bg-transparent"
                                                onClick={() => {
                                                    onRemoveItem(field.id_consumable);
                                                    remove(index);
                                                }}
                                                title="Quitar consumible"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </div>

                {/* SECCIÓN INFERIOR OPTIMIZADA: Formulario de Control e Identificación */}
                <Card className="bg-card w-full border border-border shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                Identificación del lote de consumibles
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pt-1">
                            {/* Input de Requisición */}
                            <div className="space-y-2 flex-1 max-w-xs w-full">
                                <label className="text-xs font-bold block text-foreground uppercase">
                                    Número de Requisición / Factura <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    {...register("num_requirement", { 
                                        required: "El número de requisición es obligatorio",
                                        minLength: {
                                            value: 3,
                                            message: "El número de requisición debe tener al menos 3 caracteres"}
                                    }
                                    )}
                                    placeholder="Ej. REQ-2026-8941"
                                    className={`bg-background border-input focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-sm rounded-lg shadow-sm font-medium ${errors.num_requirement ? "border-destructive focus-visible:ring-destructive" : ""
                                        }`}
                                />
                                {errors.num_requirement && (
                                    <span className="text-xs font-medium text-destructive block mt-1.5 pl-1">
                                        {errors.num_requirement.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ACCIONES DEL FORMULARIO PRINCIPAL */}
                        {/* ACCIONES DEL FORMULARIO PRINCIPAL */}
                        <div className="border-t border-border/60 pt-5 flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm transition-colors"
                            >
                                <X className="h-4 w-4 shrink-0 text-slate-500" />
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 shrink-0" />
                                        Guardar Lote
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* MODAL DE ADVERTENCIA CRÍTICA EN INGRESO */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl p-6 border border-border shadow-lg bg-card">
                    <AlertDialogHeader className="space-y-3">
                        <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 text-center sm:text-left">
                            <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground">
                                ¿Confirmar registro definitivo del lote?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                Una vez guardados estos datos en el sistema, <strong className="text-foreground font-semibold">no se permitirán modificaciones ni correcciones posteriores</strong> debido al control contable estricto de costos de absorción de almacén.
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>

                    {/* BOTONES INTERNOS DEL MODAL COHERENTES (Estilo Slate/Custom, text-xs, UPPERCASE) */}
                    {/* BOTONES INTERNOS DEL MODAL COHERENTES (Estilo Slate/Custom, text-xs, UPPERCASE) */}
                    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 w-full pt-4 sm:space-x-0 border-t border-border/40 mt-4">
                        <AlertDialogCancel
                            className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm transition-colors mt-0"
                        >
                            <X className="h-4 w-4 shrink-0 text-slate-500" />
                            Cancelar y revisar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsConfirmOpen(false);
                                if (pendingData) onSubmit(pendingData);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Save className="h-4 w-4 shrink-0" />
                            Sí, Guardar lote
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};