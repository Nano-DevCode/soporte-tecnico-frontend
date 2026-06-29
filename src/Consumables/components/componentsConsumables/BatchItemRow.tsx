import React from "react";
import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Minus, Plus, DollarSign, Trash2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import type { CreateBatchProductPayload } from "@/Consumables/actions/post-batches-consumables.action";
import type { Consumable } from "@/Consumables/interfaces/consumable.interfaces";

interface BatchItemRowProps {
    field: { id: string; id_consumable: string };
    index: number;
    consumableInfo: Consumable;
    imgUrl: string | null;
    currentAmount: number;
    itemErrors: FieldErrors<CreateBatchProductPayload["items"][number]> | undefined;
    isLoading: boolean;
    isConfirmOpen: boolean;
    register: UseFormRegister<CreateBatchProductPayload>;
    setValue: UseFormSetValue<CreateBatchProductPayload>;
    onRemoveItem: (id: string) => void;
    // removeField: (index: number) => void;
}

export const BatchItemRow: React.FC<BatchItemRowProps> = ({
    field,
    index,
    consumableInfo,
    imgUrl,
    currentAmount,
    itemErrors,
    isLoading,
    isConfirmOpen,
    register,
    setValue,
    onRemoveItem,
    // removeField,
}) => {
    const unitId = consumableInfo?.id_unit_measurement?.id;
    const accessibleRemoveLabel = t("movements.removeConsumable") || "Eliminar artículo";

    return (
        <div className="p-5 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-stretch md:items-center transition-colors hover:bg-muted/[0.04]">
            {/* Info Visual e Identificadores */}
            <div className="md:col-span-6 flex gap-3 items-center min-w-0">
                <div className="h-12 w-12 rounded-lg border border-border bg-background shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={consumableInfo?.name || "Consumable"}
                            className="h-full w-full object-contain p-1"
                        />
                    ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                    )}
                </div>
                <div className="space-y-1 min-w-0 flex-1 cursor-help" title={consumableInfo?.description}>
                    <p className="font-semibold text-sm text-foreground line-clamp-2">
                        {consumableInfo?.name || t("createBatchForm.table.loading")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-zinc-400">
                            {consumableInfo?.item_code || "---"}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${Number(unitId) === 1
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40"
                                : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40"
                            }`}>
                            {consumableInfo?.id_unit_measurement?.name || t("createBatchForm.table.defaultUnit")}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-green-400 dark:border-green-900/40">
                            {t("createBatchForm.table.usesCount")}: {consumableInfo?.number_uses || "---"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Selector Numérico Cantidad */}
            <div className="md:col-span-3 space-y-1 md:space-y-0 flex flex-col items-start md:items-center">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block md:hidden">
                    {t("createBatchForm.table.headerAmount")}
                </label>
                <div className={`flex items-center border rounded-lg overflow-hidden dark:bg-neutral-800 h-9 w-full max-w-[140px] shadow-sm ${itemErrors?.arrival_amount ? "border-destructive" : "border-input"}`}>
                    <button
                        type="button"
                        disabled={isLoading || isConfirmOpen}
                        className="px-2.5 h-full text-muted-foreground hover:bg-muted transition-colors border-r border-border disabled:opacity-50"
                        onClick={() => setValue(`items.${index}.arrival_amount`, Math.max(1, currentAmount - 1), { shouldValidate: true })}
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <input
                        type="number"
                        disabled={isLoading || isConfirmOpen}
                        className="w-full text-center bg-transparent font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground disabled:opacity-50"
                        {...register(`items.${index}.arrival_amount` as const, {
                            required: true,
                            valueAsNumber: true,
                            min: 1
                        })}
                    />
                    <button
                        type="button"
                        disabled={isLoading || isConfirmOpen}
                        className="px-2.5 h-full text-muted-foreground hover:bg-muted transition-colors border-l border-border disabled:opacity-50"
                        onClick={() => setValue(`items.${index}.arrival_amount`, currentAmount + 1, { shouldValidate: true })}
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Costo Lote */}
            <div className="md:col-span-2 space-y-1 md:space-y-0">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block md:hidden">
                    {t("createBatchForm.table.mobileCostLabel")}
                </label>
                <div className="relative w-full max-w-[140px] md:mx-auto">
                    <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground/40" />
                    <Input
                        type="number"
                        step="0.01"
                        disabled={isLoading || isConfirmOpen}
                        {...register(`items.${index}.cost_batch` as const, {
                            required: t("createBatchForm.validation.required"),
                            valueAsNumber: true,
                            validate: (value) => value > 0 || t("createBatchForm.validation.minCost")
                        })}
                        className={`h-9 pl-6 text-right pr-2 focus-visible:ring-1 focus-visible:ring-blue-600 bg-background font-bold text-sm rounded-lg shadow-sm ${itemErrors?.cost_batch ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                </div>
                {itemErrors?.cost_batch && (
                    <span className="text-[11px] font-medium text-destructive block text-left md:text-center mt-1">
                        {itemErrors.cost_batch.message}
                    </span>
                )}
            </div>
            {/* Acciones */}
            <div className="md:col-span-1 flex items-center justify-end md:justify-center mt-1 md:mt-0 pt-2 md:pt-0 border-border/40 md:border-none">
                <Button
                    type="button"
                    variant="ghost"
                    disabled={isLoading || isConfirmOpen}
                    className="h-8 w-auto md:w-8 hover:text-destructive rounded-lg flex items-center justify-center p-2 md:p-0 gap-2 transition-colors text-muted-foreground bg-transparent hover:bg-transparent disabled:opacity-40"
                    onClick={() => {
                        
                        // removeField(index);
                        onRemoveItem(field.id_consumable);
                    }}
                    title={t("createBatchForm.table.removeTitle")}
                    aria-label={accessibleRemoveLabel}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};