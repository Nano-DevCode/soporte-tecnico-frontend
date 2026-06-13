// components/ConsumableOutputForm.tsx
import React, { useEffect } from "react";
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
import { AlertCircle, Package, Layers, ClipboardList, ShoppingBag, X, Tag, Box, Trash2, Info } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {
    selectedItems: Consumable[]; 
    onSuccess: () => void;
    onRemoveItem: (id: string) => void; // <-- Nueva propiedad para quitar ítems de la lista externa
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

    const onSubmitForm = async (data: OutputFormValues) => {
        if (selectedItems.length === 0) return;

        const itemsDto: ConsumableItemDto[] = selectedItems.map((item) => ({
            id_consumable: item.id,
            quantity_consumable: data.quantities[item.id] || 1,
        }));

        const payload: CreateConsumableMovementDto = {
            id_movement_aplication: data.id_movement_aplication,
            id_departament_consumable: data.selectedDepartment?.id ? String(data.selectedDepartment.id) : undefined,
            id_ticket: data.id_movement_aplication === 2 ? String(data.selectedTicket?.id) : undefined,
            observations: data.id_movement_aplication !== 2 ? data.observations.trim() : undefined,
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
        <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y FORMULARIO */}
                <div className="order-1 lg:col-span-7 space-y-4 w-full">
                    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-foreground">Detalles del Movimiento</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Especifica el destino y motivo de la salida del inventario.</p>
                        </div>

                        {/* Selector de Aplicación */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                ¿En qué vas a ocupar los consumibles? <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-muted/60 p-1.5 rounded-xl sm:rounded-full border border-border">
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
                                            className={`flex items-center justify-center gap-2 py-2.5 sm:py-2 px-3 rounded-lg sm:rounded-full text-xs font-bold transition-all duration-200 ${
                                                isSelected
                                                    ? "bg-background text-foreground shadow-sm border border-border/80"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                                            }`}
                                        >
                                            {btn.icon}
                                            {btn.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Campos Dinámicos Anidados */}
                        <div className="space-y-4 pt-2 border-t border-border/60">
                            {applicationId === 2 && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                                        Asignar Ticket Relacionado <span className="text-red-500">*</span>
                                    </label>
                                    <CatalogSelector
                                        hookResult={ticketsHook}
                                        value={watch("selectedTicket")}
                                        onChange={(val) => setValue("selectedTicket", val)}
                                        allowCreate={false}
                                        placeholder="Buscar por folio o descripción del ticket..."
                                    />
                                    {errors.selectedTicket && (
                                        <span className="text-xs text-destructive font-semibold block mt-1">{errors.selectedTicket.message}</span>
                                    )}
                                </div>
                            )}

                            {applicationId !== 2 && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Descripción / Justificación de la salida <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="observations"
                                        control={control}
                                        rules={{ required: applicationId !== 2 ? "La justificación es obligatoria" : false }}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                placeholder={
                                                    applicationId === 3
                                                        ? "Especifica detalladamente el motivo o destino del uso interno..."
                                                        : "Describe las condiciones o mermas del daño detectado en el material..."
                                                }
                                                className="w-full p-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-28 resize-none transition-all shadow-sm"
                                            />
                                        )}
                                    />
                                    {errors.observations && (
                                        <span className="text-xs text-destructive font-semibold block mt-1">{errors.observations.message}</span>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
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
                        </div>

                        {/* Botones de acción */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/40">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/consumables')}
                                className="w-full order-2 sm:order-1 font-bold py-5 rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                                <X size={16} /> Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedItems.length === 0}
                                className="w-full order-1 sm:order-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500 disabled:bg-muted text-white font-bold py-5 rounded-xl shadow-sm transition-all duration-200 text-sm flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "Procesando PEPS..." : "Confirmar y Despachar"}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Error de Inventario</AlertTitle>
                            <AlertDescription className="text-xs font-medium opacity-90">{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* COLUMNA DERECHA: CARRITO ENRIQUECIDO */}
                <div className="order-2 lg:col-span-5 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col lg:sticky lg:top-6 w-full">
                    <div className="p-4 bg-muted/40 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-bold text-foreground">Consumibles seleccionados</span>
                        </div>
                        <span className="text-[11px] bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
                            {selectedItems.length} {selectedItems.length === 1 ? 'Consumible' : 'Consumibles'}
                        </span>
                    </div>
                    <div className="p-4 border-t border-border bg-muted/40 space-y-2.5">
                        {/* Encabezado de la sección de notas */}
                        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                            <Info size={13} className="text-orange-500 shrink-0" />
                            <span>Notas de Operación</span>
                        </div>

                        {/* Lista de recomendaciones */}
                        <ul className="space-y-1.5 text-[11px] font-medium text-muted-foreground/90 leading-relaxed">
                            <li className="flex items-start gap-1.5">
                                <span className="text-orange-500 font-bold select-none">•</span>
                                <span>
                                    Si el consumible es <strong className="font-bold text-foreground">fraccionario</strong>, ingresa el número de usos.
                                </span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="text-orange-500 font-bold select-none">•</span>
                                <span>
                                    Si el consumible es <strong className="font-bold text-foreground">unitario</strong>, ingresa el número de piezas ocupadas.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="divide-y divide-border/60 max-h-[380px] sm:max-h-[440px] overflow-y-auto bg-background/50 custom-scrollbar min-h-[150px]">
                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4 space-y-2">
                                <Package className="w-8 h-8 text-muted-foreground opacity-30" />
                                <p className="text-xs font-semibold text-muted-foreground italic">No hay consumibles en la bolsa.</p>
                            </div>
                        ) : (
                            selectedItems.map((item) => (
                                <div key={item.id} className="p-4 flex flex-col gap-2.5 hover:bg-muted/30 transition-colors">
                                    
                                    {/* Fila Superior: Descripción, ID y Controles */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[12px] font-mono text-muted-foreground font-semibold mt-0.5">
                                                {item.item_code || "N/A"}
                                            </span>
                                            <span className="text-sm text-justify text-foreground leading-tight">
                                                {item.description}
                                            </span>
                                        </div>

                                        {/* Bloque de Controles (Basura + Cantidad) */}
                                        <div className="flex items-center gap-2.5 shrink-0 self-start">
                                            {/* BOTÓN ELIMINAR (BOTECITO DE BASURA) */}
                                            <button
                                                type="button"
                                                onClick={() => onRemoveItem(item.id)}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/15 active:bg-destructive/25 transition-colors"
                                                title="Quitar consumible"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            {/* Selector de Cantidades */}
                                            <div className="flex flex-col items-end gap-1">
                                                <div className={`flex items-center bg-background border rounded-lg shadow-sm overflow-hidden h-8 transition-colors ${
                                                    item.available_stock <= 0 ? "border-destructive/40 bg-destructive/5" : "border-border"
                                                }`}>
                                                    {/* BOTÓN MENOS (-) */}
                                                    <button
                                                        type="button"
                                                        disabled={item.available_stock <= 0 || (Number(currentQuantities[item.id]) <= 1)}
                                                        onClick={() => {
                                                            const current = Number(currentQuantities[item.id]) || 1;
                                                            if (current > 1) {
                                                                setValue("quantities", { ...currentQuantities, [item.id]: current - 1 });
                                                            }
                                                        }}
                                                        className="px-2 h-full flex items-center justify-center text-muted-foreground hover:bg-accent active:bg-accent/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm font-bold border-r border-border select-none"
                                                    >
                                                        —
                                                    </button>

                                                    {/* INPUT DE CANTIDAD */}
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
                                                        className={`w-10 bg-transparent text-center text-xs font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                                            item.available_stock <= 0 ? "text-destructive opacity-50" : "text-blue-700"
                                                        }`}
                                                    />

                                                    {/* BOTÓN MÁS (+) */}
                                                    <button
                                                        type="button"
                                                        disabled={item.available_stock <= 0 || (Number(currentQuantities[item.id]) >= item.available_stock)}
                                                        onClick={() => {
                                                            const current = Number(currentQuantities[item.id]) || 1;
                                                            if (current < item.available_stock) {
                                                                setValue("quantities", { ...currentQuantities, [item.id]: current + 1 });
                                                            }
                                                        }}
                                                        className="px-2 h-full flex items-center justify-center text-muted-foreground hover:bg-accent active:bg-accent/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm font-bold border-l border-border select-none"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Indicadores de bajo stock bajo el selector */}
                                                {item.available_stock <= 0 ? (
                                                    <span className="text-[9px] text-destructive font-bold uppercase tracking-wide px-1">Agotado</span>
                                                ) : item.available_stock <= 3 ? (
                                                    <span className="text-[9px] text-orange-500 font-medium px-1">Solo {item.available_stock} disp.</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fila Inferior: Metadata */}
                                    <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-muted-foreground">
                                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md border border-border/50">
                                            <Tag size={12} className="text-zinc-400" />
                                            {item.id_brand_consumable?.name || "Sin Marca"}
                                        </span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                                                item.id_unit_measurement?.id === 1 
                                                    ? "bg-orange-100 text-orange-700 border-orange-200" 
                                                    : "bg-blue-100 text-blue-700 border-blue-200"
                                            }`}>
                                                <Tag size={12} />
                                                {item.id_unit_measurement?.name || "Sin identificar"}
                                            </span>

                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                                            item.available_stock < 10 
                                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40" 
                                                : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40"
                                        }`}>
                                            <Box size={12} />
                                            Stock: {item.available_stock}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center text-[11px] font-bold text-muted-foreground font-mono uppercase tracking-wider">
                        <span>Método de Almacén:</span>
                        <span className="text-foreground">(FIFO)</span>
                    </div>
                </div>

            </div>
        </form>
    );
};