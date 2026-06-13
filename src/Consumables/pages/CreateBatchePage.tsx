import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumablesBagData } from "../hooks/useConsumables";
import { createBatchesProductAction, type CreateBatchProductPayload } from "../actions/post-batches-consumables.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, AlertTriangle, ArrowLeft, Loader2, ShoppingBag, Image as ImageIcon, DollarSign, Layers } from "lucide-react";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CreateBatchPage() {
    const navigate = useNavigate();
    const { bagIds, removeItem, clearBag } = useConsumableBagStore();
    const { bagConsumables, isBagLoading } = useConsumablesBagData(bagIds);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CreateBatchProductPayload>({
        defaultValues: {
            num_requirement: "",
            items: [],
        }
    });

    const { fields, remove } = useFieldArray({
        control,
        name: "items",
    });

    const getFullImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
            return url;
        }
        const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
        return `${backendBaseUrl}/${cleanUrl}`;
    };

    useEffect(() => {
        if (bagConsumables.length > 0 && fields.length === 0) {
            const formItems = bagConsumables.map((c) => ({
                id_consumable: c.id,
                arrival_amount: 1, 
                cost_batch: 0,      
            }));
            reset({ num_requirement: "", items: formItems });
        }
    }, [bagConsumables, reset, fields.length]);

    if (isBagLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (bagIds.length === 0) {
        return (
            <div className="max-w-max mx-auto space-y-6 py-6 mt-6 px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Consumibles seleccionados: 0</span>
                    </div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Estructurar Nuevo Lote</h1>
                </div>
                <div className="text-center p-8 sm:p-12 border border-dashed rounded-xl bg-card min-w-full sm:min-w-[500px]">
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">No tienes consumibles seleccionados en tu bolsa para registrar una remesa.</p>
                    <Button onClick={() => navigate("/consumables")} className="w-full sm:w-auto">Explorar Catálogo</Button>
                </div>
            </div>
        );
    }

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const onConfirmSave = handleSubmit(async (data) => {
        setIsConfirmOpen(false);
        setIsSubmitting(true);
        try {
            const response = await createBatchesProductAction(data);
            clearBag();
            alert(response.message || "Lote guardado con éxito.");
            navigate("/batches-products");
        } catch (error) {
            console.error("Error al guardar el lote:", error);
            alert("Hubo un conflicto o un error al procesar el lote en el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
            
            {/* CABEZAL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="w-full sm:w-auto order-2 sm:order-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
                </Button>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border order-1 sm:order-2 w-full sm:w-auto">
                    <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Consumibles seleccionados: <strong className="text-foreground">{bagIds.length}</strong></span>
                </div>
            </div>

            {/* TÍTULO */}
            <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Estructurar Nuevo Lote de Almacén</h1>
                <p className="text-sm text-muted-foreground">
                    Registra la entrada de mercancía rellenando las cantidades de arribo y costos correspondientes.
                </p>
            </div>

            <form onSubmit={handlePreSubmit} className="space-y-6">
                
                {/* SECCIÓN MAESTRO: Requisición */}
                <Card className="border-blue-200 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-900 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Datos Generales de Recepción
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Número de Requisición / Factura</label>
                                <Input
                                    {...register("num_requirement", { required: "El número de requisición es obligatorio" })}
                                    placeholder="Ej. REQ-2026-8941"
                                    className="bg-background border-muted-foreground/20 focus-visible:ring-blue-500"
                                />
                                {errors.num_requirement && (
                                    <span className="text-xs font-medium text-destructive">{errors.num_requirement.message}</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SECCIÓN DETALLE: Lista Llamativa de Productos */}
                <Card className="border-muted/60 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Layers className="h-5 w-5 text-muted-foreground" />
                            Items listos para ingreso
                        </CardTitle>
                        <CardDescription>
                            Asigna las unidades físicas que entraron físicamente a la bodega y su costo pactado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-muted/60">
                        {fields.map((field, index) => {
                            const consumableInfo = bagConsumables.find((c) => c.id === field.id_consumable);
                            const imgUrl = getFullImageUrl(consumableInfo?.imageUrl);

                            return (
                                <div 
                                    key={field.id} 
                                    className="p-4 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-stretch border-t lg:items-center transition-colors hover:bg-muted/20"
                                >
                                    {/* Bloque Izquierdo: Visual & Meta-datos */}
                                    <div className="lg:col-span-5 flex gap-3 items-start min-w-0">
                                        <div className="p-0 h-12 w-12 sm:h-10 sm:w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 shrink-0 mt-0.5 overflow-hidden flex items-center justify-center bg-white">
                                            {imgUrl ? (
                                                <img 
                                                    src={imgUrl} 
                                                    alt={consumableInfo?.description || "Consumable"} 
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <p className="font-semibold text-sm text-foreground break-words sm:truncate">
                                                {consumableInfo?.description || "Cargando..."}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border">
                                                    {consumableInfo?.item_code || "---"}
                                                </span>
                                                <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60">
                                                    {consumableInfo?.id_unit_measurement?.name || "U.M."}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bloque Central: Inputs de valores */}
                                    <div className="lg:col-span-6 grid grid-cols-2 gap-3 items-end">
                                        {/* Input Cantidad */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                                Cantidad llegada
                                            </label>
                                            <Input
                                                type="number"
                                                min="1"
                                                {...register(`items.${index}.arrival_amount` as const, {
                                                    required: true,
                                                    valueAsNumber: true,
                                                    min: 1
                                                })}
                                                className="h-9 focus-visible:ring-blue-500 font-medium w-full"
                                            />
                                        </div>

                                        {/* Input Costo Lote */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                                Costo del lote del consumible ($)
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                                <Input
                                                    type="number"
                                                    step="0.0001"
                                                    min="0"
                                                    {...register(`items.${index}.cost_batch` as const, {
                                                        required: true,
                                                        valueAsNumber: true,
                                                        min: 0
                                                    })}
                                                    className="h-9 pl-7 focus-visible:ring-blue-500 font-medium w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bloque Derecho: Botón de eliminar */}
                                    <div className="lg:col-span-1 flex justify-end lg:justify-center pt-2 lg:pt-0   lg:border-none mt-2 lg:mt-0">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-full lg:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors gap-2 lg:gap-0 justify-center"
                                            onClick={() => {
                                                removeItem(field.id_consumable); 
                                                remove(index); 
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="lg:hidden text-xs font-medium">Quitar del lote</span>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Botones de Acción Globales */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting} className="w-full sm:w-auto order-2 sm:order-1">
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium w-full sm:w-auto order-1 sm:order-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                            </>
                        ) : (
                            "Guardar Lote de Almacén"
                        )}
                    </Button>
                </div>
            </form>

            {/* ALERT DIALOG */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            ¿Estás completamente seguro de guardar el lote?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2 text-xs sm:text-sm">
                            <p>
                                Una vez registrados estos datos en el sistema, <strong>no se permitirán modificaciones ni correcciones posteriores</strong> debido al control estricto de costos de absorción de almacén.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="font-semibold w-full sm:w-auto mt-0">Cancelar y revisar</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirmSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-auto">
                            Sí, Guardar Definitivamente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}