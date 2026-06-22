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
import { sileo } from "sileo"; // Importamos sileo para las promesas controladas
import { handleBackendErrors } from "../utils/handleBackendErrors"; // Ajusta la ruta a tu archivo de utilidad
import {
    AlertCircle, Package, Layers, ClipboardList, ShoppingBag,
    Tag, Box, Trash2, Info, Save,
    X,
    Layers3,
    AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router";
import { t } from "i18next";

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
    const { executeOutputMovement, isSubmitting } = useConsumableMovements();
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
        setError, // Extraemos setError para mapear las alertas a los inputs
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

    // Función que maneja el cambio controlado del tipo de aplicación (Disparo Único)
    const handleApplicationChange = (targetId: number) => {
        setValue("id_movement_aplication", targetId);

        if (targetId === 3 || targetId === 4) {
            const departmentsList: CatalogOption[] = departmentsHook.options || [];
            const defaultDept = departmentsList.find(
                (dept) => dept.name.trim().toLowerCase() === "departamento de centro de cómputo" ||
                    dept.name.trim().toLowerCase() === "departamento de centro de computo"
            );

            if (defaultDept) {
                setValue("selectedDepartment", defaultDept);
            } else {
                setValue("selectedDepartment", { id: "", name: "Departamento de Centro de Cómputo" });
            }
            setValue("selectedTicket", null);
        } else if (targetId === 2) {
            setValue("selectedDepartment", null);
            setValue("observations", "");
        }
    };

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

    // 2. Segundo paso: Si confirma en el modal, se ejecuta la petición PEPS real controlada por Sileo
    const handleConfirmMovement = async () => {
        if (!pendingData) return;

        const itemsDto: ConsumableItemDto[] = selectedItems.map((item) => ({
            id_consumable: item.id,
            quantity_consumable: pendingData.quantities[item.id] || 1,
        }));

        const payload: CreateConsumableMovementDto = {
            id_movement_aplication: pendingData.id_movement_aplication,
            id_departament_consumable: pendingData.selectedDepartment?.id ? String(pendingData.selectedDepartment.id) : undefined,
            id_ticket: pendingData.id_movement_aplication === 2 ? String(pendingData.selectedTicket?.id) : undefined,
            observations: pendingData.observations.trim() || undefined,
            items: itemsDto,
        };

        try {
            // Sileo manejará la notificación flotante interactiva y capturará los errores dinámicos del backend
            await sileo.promise(
                new Promise((resolve, reject) => {
                    executeOutputMovement(payload, () => resolve(true)).catch(reject);
                }),
                {
                    loading: { title: t("consumableForm.loadingTitle") },
                    success: { title: t("consumableForm.successTitle") },
                    error: (err) => {
                        let dynamicDescription = t("consumableForm.errorUnexpected");

                        // Mapeamos los errores hacia react-hook-form usando la utilidad común
                        handleBackendErrors(
                            err,
                            setError,
                            [
                                { backendKeyword: "ticket", fieldPath: "selectedTicket" },
                                { backendKeyword: "departament", fieldPath: "selectedDepartment" },
                                { backendKeyword: "observations", fieldPath: "observations" },
                                { backendKeyword: "quantity", fieldPath: "quantities" },
                                { backendKeyword: "aplication", fieldPath: "id_movement_aplication" }
                            ],
                            (cleanMessage) => {
                                dynamicDescription = cleanMessage;
                            }
                        );

                        // Cerramos el modal de confirmación para que el usuario pueda ver qué input falló
                        setShowConfirmDialog(false);

                        return {
                            title: t("consumableForm.errorInventoryTitle"),
                            description: dynamicDescription,
                            duration: 6000
                        };
                    }
                }
            );

            // Si todo sale bien, limpiamos y disparamos el éxito
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

        } catch (e) {
            console.error("Error capturado en el flujo de salida:", e);
        }
    };

    const applicationButtons = [
        { id: 2, label: t("consumableForm.labels.ticket"), icon: <ClipboardList className="w-4 h-4" /> },
        { id: 3, label: t("consumableForm.labels.internalUse"), icon: <Layers className="w-4 h-4" /> },
        { id: 4, label: t("consumableForm.labels.damagedMaterial"), icon: <AlertCircle className="w-4 h-4" /> },
    ];

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitForm)} className="w-full space-y-6">
                <div className="w-full rounded-xl overflow-hidden space-y-6">
                    {/* SECCIÓN SUPERIOR: CONSUMIBLES SELECCIONADOS */}
                    <div className="rounded-xl border-2 bg-card shadow-sm w-full">
                        <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/60">
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-orange-500 shrink-0" />
                                    <div className="text-base font-semibold tracking-tight text-foreground">
                                        {t("consumableForm.sections.selectedTitle")}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {t("consumableForm.sections.selectedDescription")}
                                </div>
                            </div>
                            <span className="self-start md:mt-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40 shrink-0">
                                {selectedItems.length === 1
                                    ? t("consumableForm.sections.count_one", { count: selectedItems.length })
                                    : t("consumableForm.sections.count_other", { count: selectedItems.length })}
                            </span>
                        </div>

                        {/* Notas de Operación */}
                        <div className="p-4 pt-0 border-b border-border/60 space-y-2 bg-muted/20 w-full mt-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground pt-3">
                                <Info size={14} className="text-orange-500 shrink-0" />
                                <span>{t("consumableForm.notes.title")}</span>
                            </div>
                            <ul className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        {t("consumableForm.notes.fractionalBefore")}
                                        <strong className="font-semibold text-foreground">
                                            {t("consumableForm.notes.fractionalBold")}
                                        </strong>
                                        {t("consumableForm.notes.fractionalAfter")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        {t("consumableForm.notes.unitaryBefore")}
                                        <strong className="font-semibold text-foreground">
                                            {t("consumableForm.notes.unitaryBold")}
                                        </strong>
                                        {t("consumableForm.notes.unitaryAfter")}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Lista de Consumibles */}
                        <div className="divide-y divide-border/60 overflow-y-auto bg-background/50">
                            {selectedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center px-4 space-y-2">
                                    <Package className="w-8 h-8 text-muted-foreground opacity-30" />
                                    <p className="text-sm font-medium text-muted-foreground italic">{t("consumableForm.list.empty")}</p>
                                </div>
                            ) : (
                                selectedItems.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col min-w-0 flex-1 space-y-0.5" title={item.description}>
                                                <span className="text-xs font-mono font-semibold text-muted-foreground" >
                                                    {item.item_code || "N/A"}
                                                </span>
                                                <span className="text-sm font-medium leading-snug text-foreground line-clamp-2">
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="p-2 h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive active:bg-destructive/20 transition-colors"
                                                    title={t("consumableForm.list.removeTooltip")}
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
                                                        <span className="text-[10px] text-destructive font-semibold uppercase tracking-wide px-1">{t("consumableForm.list.outOfStock")}</span>
                                                    ) : item.available_stock <= 3 ? (
                                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium px-1">{t("consumableForm.list.lowStock", { count: item.available_stock })}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md border border-border/60">
                                                <Tag size={12} className="text-muted-foreground/70" />
                                                {item.id_brand_consumable?.name || t("consumableForm.list.noBrand")}
                                            </span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${item.id_unit_measurement?.id === 1 ? "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200/60" : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60"}`}>
                                                <Tag size={12} />
                                                {item.id_unit_measurement?.name || t("consumableForm.list.unidentified")}
                                            </span>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${item.available_stock < 10 ? "bg-destructive/5 text-destructive border-destructive/25" : "bg-muted text-muted-foreground border-border"}`}>
                                                <Box size={12} />
                                                {t("consumableForm.list.stockLabel", { count: item.available_stock })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 border-t border-border bg-muted/40 flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>{t("consumableForm.footer.methodLabel")}</span>
                            <span className="font-semibold text-muted-foreground">{t("consumableForm.footer.methodValue")}</span>
                        </div>
                    </div>

                    {/* SECCIÓN INFERIOR: FORMULARIO DE DETALLES */}
                    <div className="rounded-xl border-2 bg-card p-5 sm:p-6 shadow-sm space-y-2">
                        <div className="flex items-center gap-2">
                            <Layers3 className="w-4 h-4 text-blue-700 shrink-0" />
                            <div className="text-base font-semibold tracking-tight text-foreground">
                                {t("consumableForm.details.title")}
                            </div>
                        </div>
                        <div className="">
                            <p className="text-sm text-muted-foreground mt-1">{t("consumableForm.details.description")}</p>
                        </div>

                        {/* Selector de Aplicación */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider block">
                                {t("consumableForm.details.applicationQuestion")} <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-muted p-1 rounded-lg border border-border/60">
                                {applicationButtons.map((btn) => {
                                    const isSelected = applicationId === btn.id;
                                    return (
                                        <button
                                            key={btn.id}
                                            type="button"
                                            onClick={() => handleApplicationChange(btn.id)}
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
                                        {t("consumableForm.details.ticketLabel")} <span className="text-destructive">*</span>
                                    </label>
                                    <Controller
                                        name="selectedTicket"
                                        control={control}
                                        rules={{ required: t("consumableForm.errors.ticketRequired") }}
                                        render={({ field }) => (
                                            <div className="space-y-1.5 w-full">
                                                <CatalogSelector
                                                    hookResult={ticketsHook}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    allowCreate={false}
                                                    placeholder={t("consumableForm.details.ticketPlaceholder")}
                                                />
                                            </div>
                                        )}
                                    />
                                    {errors.selectedTicket && (
                                        <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                            <AlertCircle size={13} /> {errors.selectedTicket.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider block">
                                    {t("consumableForm.details.departmentLabel", {
                                        context: applicationId === 2 ? "optional" : "default"
                                    })}
                                </label>
                                <CatalogSelector
                                    hookResult={departmentsHook}
                                    value={watch("selectedDepartment")}
                                    onChange={(val) => setValue("selectedDepartment", val)}
                                    allowCreate={false}
                                    placeholder={t("consumableForm.details.departmentPlaceholder")}
                                />
                                {errors.selectedDepartment && (
                                    <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                        <AlertCircle size={13} /> {errors.selectedDepartment.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5 animate-in fade-in duration-200">
                                <label className="text-xs font-bold uppercase tracking-wider block">
                                    {t("consumableForm.details.observationsLabel")}
                                    {applicationId !== 2 && <span className="text-destructive"> *</span>}
                                    {applicationId === 2 && <span className="text-muted-foreground font-normal lowercase italic"> ({t("consumableForm.details.optional")})</span>}
                                </label>

                                <Controller
                                    name="observations"
                                    control={control}
                                    rules={{
                                        required: applicationId !== 2 ? t("consumableForm.errors.justificationRequired") : false
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            placeholder={
                                                applicationId === 2
                                                    ? t("consumableForm.details.observationsPlaceholderTicket")
                                                    : applicationId === 3
                                                        ? t("consumableForm.details.observationsPlaceholderInternal")
                                                        : t("consumableForm.details.observationsPlaceholderDamaged")
                                            }
                                            className={`w-full p-3 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-24 resize-none transition-all shadow-sm ${errors.observations ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                                        />
                                    )}
                                />

                                {errors.observations && (
                                    <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                        <AlertCircle size={13} /> {errors.observations.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botón Principal de Envío */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/consumables')}
                                className="w-full sm:w-auto h-11 px-5 text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <X size={15} />
                                {t("consumableForm.details.cancel")}
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting || selectedItems.length === 0}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-11 px-5 text-sm font-semibold rounded-lg shadow-sm"
                            >
                                <Save size={16} />
                                {t("consumableForm.details.submitButton")}
                            </Button>
                        </div>

                    </div>
                </div>
            </form>

            {/* MODAL DE CONFIRMACIÓN IRREVERSIBLE */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-md border-border/80 shadow-lg">
                    <DialogHeader className="space-y-1.5">
                        <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-base font-bold text-foreground">
                            {t("consumableForm.dialog.title")}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            {t("consumableForm.dialog.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
                        {/* Encabezado Principal */}
                        <div className="p-3 bg-muted/50 border-b border-border/60 flex justify-between items-center">
                            <span className="font-bold uppercase tracking-wider text-[10px] text-foreground">
                                {t("consumableForm.dialog.summaryTitle")}
                            </span>
                            <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                {selectedItems.length} {selectedItems.length === 1
                                    ? t("consumableForm.dialog.itemCount_one")
                                    : t("consumableForm.dialog.itemCount_other")}
                            </span>
                        </div>

                        {/* Encabezados de la Tabla */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-1.5 bg-muted/20 border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                            <div className="col-span-8 sm:col-span-9">{t("consumableForm.dialog.tableHeaderConsumable")}</div>
                            <div className="col-span-4 sm:col-span-3 text-right">{t("consumableForm.dialog.tableHeaderQuantity")}</div>
                        </div>

                        {/* Cuerpo de la Tabla con Scroll */}
                        <div className="max-h-40 overflow-y-auto divide-y divide-border/40 text-xs px-4 bg-background [scrollbar-width:thin]">
                            {selectedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-2 py-2.5 items-center hover:bg-muted/10 transition-colors"
                                >
                                    <div className="col-span-8 sm:col-span-9 pr-2">
                                        <span className="block truncate font-medium text-foreground" title={item.name}>
                                            {item.name}
                                        </span>
                                    </div>

                                    <div className="col-span-4 sm:col-span-3 text-right">
                                        <span className="inline-block font-mono bg-muted/80 dark:bg-muted/40 px-2 py-0.5 rounded font-semibold text-foreground text-[11px]">
                                            {currentQuantities[item.id]} u
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
                            {t("consumableForm.dialog.btnReview")}
                        </Button>
                        <Button type="button" onClick={handleConfirmMovement} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {t("consumableForm.dialog.btnConfirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};