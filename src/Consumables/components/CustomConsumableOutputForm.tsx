// components/ConsumableOutputForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useConsumableMovements } from "../hooks/useConsumableMovements";
import {
    useTicketsConsumables,
    useDepartmentsConsumables
} from "../hooks/useConsumableCatalog";
import { CatalogSelector } from "./CatalogSelector";
import type { ConsumableItemDto, CreateConsumableMovementDto } from "../interfaces/consumable-movement.interfaces";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertCircle, Package, Layers, ClipboardList, ShoppingBag,
    X, Tag, Box, Trash2, Info, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router";

// Importaciones de Shadcn UI para el diálogo/modal
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    selectedItems: Consumable[];
    onSuccess: () => void;
    onRemoveItem: (id: string) => void;
}

interface CatalogOption {
    id: string | number;
    name: string;
}

interface OutputFormValues {
    id_movement_type: number | string;
    id_movement_aplication: number;
    selectedTicket: CatalogOption | null;
    selectedDepartment: CatalogOption | null;
    observations: string;
    quantities: Record<string, number>;
}

export const ConsumableOutputForm: React.FC<Props> = ({ selectedItems, onSuccess, onRemoveItem }) => {
    const { executeOutputMovement, isSubmitting, error } = useConsumableMovements();
    const navigate = useNavigate();
    const ticketsHook = useTicketsConsumables();
    const departmentsHook = useDepartmentsConsumables();

    // Estado para controlar la apertura del modal de confirmación irreversible
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<OutputFormValues | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<OutputFormValues>({
        defaultValues: {
            id_movement_type: 2,
            id_movement_aplication: 2,
            selectedTicket: null,
            selectedDepartment: null,
            observations: "",
            quantities: {},
        }
    });

    const applicationId = watch("id_movement_aplication");
    const currentQuantities = watch("quantities");

    useEffect(() => {
        const updatedQuantities = { ...currentQuantities };
        let changed = false;
        selectedItems.forEach((item) => {
            if (!updatedQuantities[item.id]) {
                updatedQuantities[item.id] = 1;
                changed = true;
            }
        });
        if (changed) {
            setValue("quantities", updatedQuantities);
        }
    }, [selectedItems, setValue, currentQuantities]);

    // 1. Primer paso del Submit: Retiene los datos y abre el diálogo de advertencia
    const onSubmitForm = (data: OutputFormValues) => {
        if (selectedItems.length === 0) return;
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    // 2. Segundo paso: Si confirma en el modal, se ejecuta la petición PEPS real
    const handleConfirmMovement = async () => {
        if (!pendingData) return;

        const itemsDto: ConsumableItemDto[] = selectedItems.map((item) => ({
            id_consumable: item.id,
            quantity_consumable: pendingData.quantities[item.id] || 1,
        }));

        // Si es aplicación 2 (ticket) conservamos las observaciones si el usuario escribió algo
        const payload: CreateConsumableMovementDto = {
            id_movement_aplication: pendingData.id_movement_aplication,
            id_departament_consumable: pendingData.selectedDepartment?.id ? String(pendingData.selectedDepartment.id) : undefined,
            id_ticket: pendingData.id_movement_aplication === 2 ? String(pendingData.selectedTicket?.id) : undefined,
            observations: pendingData.observations.trim() || undefined,
            items: itemsDto,
        };

        try {
            await executeOutputMovement(payload, () => {
                reset({
                    id_movement_aplication: 2,
                    selectedTicket: null,
                    selectedDepartment: null,
                    observations: "",
                    quantities: {},
                });
                setShowConfirmDialog(false);
                setPendingData(null);
                onSuccess();
            });
        } catch (e) {
            console.error(e);
        }
    };

    const applicationButtons = [
        { id: 2, label: "Ticket", icon: <ClipboardList className="w-4 h-4" /> },
        { id: 3, label: "Uso Interno", icon: <Layers className="w-4 h-4" /> },
        { id: 4, label: "Material Dañado", icon: <AlertCircle className="w-4 h-4" /> },
    ];

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitForm)} className="w-full  space-y-6">
                <div className=" w-full  rounded-xl overflow-hidden space-y-6">
                    {/* SECCIÓN SUPERIOR: CONSUMIBLES SELECCIONADOS */}
                    <div className=" rounded-xl border-2 border-zinc-200/75 bg-card shadow-sm  w-full">
                        <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/60">
                            {/* Contenedor del Título y la Descripción */}
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-orange-500 shrink-0" />
                                    <div className="text-base font-semibold tracking-tight text-foreground">
                                        Consumibles seleccionados para consumo
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Agrega la cantidad del consumible a usar y rellena el formulario para completar el movimiento.
                                </div>
                            </div>

                            {/* Contador de Consumibles - Ajustado para alinearse a la derecha en MD y abajo en Mobile */}
                            <span className="self-start md:mt-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40 shrink-0">
                                {selectedItems.length} {selectedItems.length === 1 ? 'Consumible' : 'Consumibles'}
                            </span>
                        </div>

                        {/* Notas de Operación */}
                        <div className="p-4 pt-0 border-b border-border/60 space-y-2 bg-muted/20 w-full mt-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground pt-3">
                                <Info size={14} className="text-orange-500 shrink-0" />
                                <span>Notas de Operación</span>
                            </div>
                            <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span>
                                        Si el consumible es <strong className="font-semibold text-foreground">fraccionario</strong>, ingresa el número de usos.
                                    </span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span>
                                        Si el consumible es <strong className="font-semibold text-foreground">unitario</strong>, ingresa el número de piezas ocupadas.
                                    </span>
                                </li>
                            </ul>
                        </div>
                        {/* Lista de Consumibles */}
                        <div className="divide-y divide-border/60 overflow-y-auto bg-background/50">
                            {selectedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center px-4 space-y-2">
                                    <Package className="w-8 h-8 text-muted-foreground opacity-30" />
                                    <p className="text-sm font-medium text-muted-foreground italic">No hay consumibles en la bolsa.</p>
                                </div>
                            ) : (
                                selectedItems.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
                                                <span className="text-xs font-mono font-semibold text-muted-foreground">
                                                    {item.item_code || "N/A"}
                                                </span>
                                                <span className="text-sm font-medium leading-snug text-foreground line-clamp-2">
                                                    {item.description}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="p-2 h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive active:bg-destructive/20 transition-colors"
                                                    title="Quitar consumible"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="flex flex-col items-end gap-1">
                                                    <div className={`flex items-center bg-background border rounded-lg shadow-sm overflow-hidden h-9 transition-colors ${item.available_stock <= 0 ? "border-destructive/40 bg-destructive/5" : "border-input focus-within:ring-1 focus-within:ring-ring"}`}>
                                                        <button
                                                            type="button"
                                                            disabled={item.available_stock <= 0 || (Number(currentQuantities[item.id]) <= 1)}
                                                            onClick={() => {
                                                                const current = Number(currentQuantities[item.id]) || 1;
                                                                if (current > 1) {
                                                                    setValue("quantities", { ...currentQuantities, [item.id]: current - 1 });
                                                                }
                                                            }}
                                                            className="px-2.5 h-full flex items-center justify-center text-muted-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm font-medium border-r border-border select-none"
                                                        >
                                                            —
                                                        </button>

                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            min={item.available_stock > 0 ? 1 : 0}
                                                            max={item.available_stock}
                                                            disabled={item.available_stock <= 0}
                                                            value={currentQuantities[item.id] ?? (item.available_stock > 0 ? 1 : 0)}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === "") {
                                                                    setValue("quantities", { ...currentQuantities, [item.id]: "" as unknown as number });
                                                                    return;
                                                                }
                                                                let num = parseInt(val, 10);
                                                                if (isNaN(num) || num < 1) num = 1;
                                                                if (num > item.available_stock) num = item.available_stock;

                                                                setValue("quantities", { ...currentQuantities, [item.id]: num });
                                                            }}
                                                            onBlur={() => {
                                                                const val = currentQuantities[item.id];
                                                                if (String(val).trim() === "" || val === undefined || val === null) {
                                                                    setValue("quantities", {
                                                                        ...currentQuantities,
                                                                        [item.id]: item.available_stock > 0 ? 1 : 0
                                                                    });
                                                                }
                                                            }}
                                                            className={`w-12 bg-transparent text-center text-sm font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${item.available_stock <= 0 ? "text-destructive opacity-50" : "text-foreground"}`}
                                                        />

                                                        <button
                                                            type="button"
                                                            disabled={item.available_stock <= 0 || (Number(currentQuantities[item.id]) >= item.available_stock)}
                                                            onClick={() => {
                                                                const current = Number(currentQuantities[item.id]) || 1;
                                                                if (current < item.available_stock) {
                                                                    setValue("quantities", { ...currentQuantities, [item.id]: current + 1 });
                                                                }
                                                            }}
                                                            className="px-2.5 h-full flex items-center justify-center text-muted-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm font-medium border-l border-border select-none"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {item.available_stock <= 0 ? (
                                                        <span className="text-[10px] text-destructive font-semibold uppercase tracking-wide px-1">Agotado</span>
                                                    ) : item.available_stock <= 3 ? (
                                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium px-1">Solo {item.available_stock} disp.</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md border border-border/60">
                                                <Tag size={12} className="text-muted-foreground/70" />
                                                {item.id_brand_consumable?.name || "Sin Marca"}
                                            </span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${item.id_unit_measurement?.id === 1 ? "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200/60" : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60"}`}>
                                                <Tag size={12} />
                                                {item.id_unit_measurement?.name || "Sin identificar"}
                                            </span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${item.available_stock < 10 ? "bg-destructive/5 text-destructive border-destructive/25" : "bg-muted text-muted-foreground border-border"}`}>
                                                <Box size={12} />
                                                Stock: {item.available_stock}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 border-t border-border bg-muted/40 flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>Método de Almacén:</span>
                            <span className="font-semibold text-muted-foreground">Primero en Entrar, Primero en Salir.</span>
                        </div>
                    </div>

                    {/* SECCIÓN INFERIOR: FORMULARIO DE DETALLES */}
                    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-5">
                        <div>
                            <h3 className="text-base font-semibold tracking-tight text-foreground">Detalles del Movimiento</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Especifica el destino y motivo de la salida del inventario.</p>
                        </div>

                        {/* Selector de Aplicación */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider block">
                                ¿En qué vas a ocupar los consumibles? <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-muted p-1 rounded-lg border border-border/60">
                                {applicationButtons.map((btn) => {
                                    const isSelected = applicationId === btn.id;
                                    return (
                                        <button
                                            key={btn.id}
                                            type="button"
                                            onClick={() => {
                                                setValue("id_movement_aplication", btn.id);
                                                if (btn.id === 2) setValue("observations", "");
                                                else setValue("selectedTicket", null);
                                            }}
                                            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${isSelected ? "bg-background text-foreground shadow-sm border border-border/20 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-background/50"}`}
                                        >
                                            {btn.icon}
                                            {btn.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Campos Dinámicos */}
                        <div className="space-y-4 pt-2 border-t border-border/60">

                            {applicationId === 2 && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                    <label className="text-xs font-bold uppercase tracking-wider block">
                                        Selecciona el Folio del Ticket <span className="text-destructive">*</span>
                                    </label>
                                    <CatalogSelector
                                        hookResult={ticketsHook}
                                        value={watch("selectedTicket")}
                                        onChange={(val) => setValue("selectedTicket", val)}
                                        allowCreate={false}
                                        placeholder="Buscar por folio o descripción del ticket..."
                                    />
                                    {errors.selectedTicket && (
                                        <span className="text-xs text-destructive font-medium block mt-1">
                                            {errors.selectedTicket.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider block">
                                    Departamento Destino (Opcional)
                                </label>
                                <CatalogSelector
                                    hookResult={departmentsHook}
                                    value={watch("selectedDepartment")}
                                    onChange={(val) => setValue("selectedDepartment", val)}
                                    allowCreate={false}
                                    placeholder="Seleccionar departamento de destino..."
                                />
                            </div>

                            <div className="space-y-1.5 animate-in fade-in duration-200">
                                <label className="text-xs font-bold uppercase tracking-wider block">
                                    Descripción / Justificación de la salida
                                    {applicationId !== 2 && <span className="text-destructive"> *</span>}
                                    {applicationId === 2 && <span className="text-muted-foreground font-normal lowercase italic"> (opcional)</span>}
                                </label>

                                <Controller
                                    name="observations"
                                    control={control}
                                    rules={{
                                        required: applicationId !== 2 ? "La justificación es obligatoria" : false
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            placeholder={
                                                applicationId === 2
                                                    ? "Notas u observaciones adicionales sobre el despacho de este ticket (opcional)..."
                                                    : applicationId === 3
                                                        ? "Especifica detalladamente el motivo o destino del uso interno..."
                                                        : "Describe las condiciones o mermas del daño detectado en el material..."
                                            }
                                            className="w-full p-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-24 resize-none transition-all shadow-sm"
                                        />
                                    )}
                                />

                                {errors.observations && (
                                    <span className="text-xs text-destructive font-medium block mt-1">
                                        {errors.observations.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción del Formulario */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/consumables')}
                                className="w-full order-2 sm:order-1 font-semibold h-10 text-sm flex items-center justify-center gap-2 rounded-lg"
                            >
                                <X size={15} /> Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedItems.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm w-full sm:w-auto order-1 sm:order-2 h-10 text-sm rounded-lg transition-all"
                            >
                                Confirmar y Despachar
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive rounded-xl animate-in fade-in">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-semibold text-sm">Error de Inventario</AlertTitle>
                            <AlertDescription className="text-xs opacity-90 font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                </div>
            </form>

            {/* MODAL DE ADVERTENCIA CRÍTICA / PEPS */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[440px] rounded-2xl gap-5 p-6 border border-border/80 bg-card shadow-lg animate-in zoom-in-95 duration-200">
                    <DialogHeader className="space-y-3">
                        <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 text-center sm:text-left">
                            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                                ¿Confirmar salida de almacén?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                Una vez registrado este movimiento en el sistema, <strong className="text-foreground font-semibold">no se podrá editar, modificar ni eliminar</strong> para mantener la consistencia del historial de auditoría y las capas PEPS.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* Resumen rápido de lo que se va a despachar */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground space-y-1.5">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-foreground block">Resumen del despacho:</span>
                        <div className="flex justify-between font-medium">
                            <span>Artículos únicos:</span>
                            <span className="text-foreground">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Tipo de aplicación:</span>
                            <span className="text-foreground">
                                {applicationButtons.find(b => b.id === applicationId)?.label || "N/A"}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                            disabled={isSubmitting}
                            className="w-full font-semibold h-10 text-sm rounded-lg"
                        >
                            Volver y revisar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmMovement}
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-semibold h-10 text-sm rounded-lg flex items-center justify-center gap-1.5"
                        >
                            {isSubmitting ? "Procesando..." : "Sí, registrar salida"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};