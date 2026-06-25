import React from "react";
import { Package, ShoppingBag, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ConsumableItemRow } from "./OutputMovementItemRow";
import type { Consumable } from "../../interfaces/consumable.interfaces";

interface SelectedConsumablesCardProps {
    selectedItems: Consumable[];
    currentQuantities: Record<string, number>;
    onRemoveItem: (id: string) => void;
    onQuantityChange: (id: string, value: number) => void;
    onQuantityBlur: (id: string, item: Consumable, value: unknown) => void;
}

export const SelectedConsumablesCard: React.FC<SelectedConsumablesCardProps> = ({
    selectedItems,
    currentQuantities,
    onRemoveItem,
    onQuantityChange,
    onQuantityBlur,
}) => {
    const { t } = useTranslation();

    return (
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
                            {t("consumableForm.notes.fractionalBefore")}{" "}
                            <strong className="font-semibold text-foreground">
                                {t("consumableForm.notes.fractionalBold")}
                            </strong>{" "}
                            {t("consumableForm.notes.fractionalAfter")}
                        </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="text-orange-500 font-medium select-none">•</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                            {t("consumableForm.notes.unitaryBefore")}{" "}
                            <strong className="font-semibold text-foreground">
                                {t("consumableForm.notes.unitaryBold")}
                            </strong>{" "}
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
                        <p className="text-sm font-medium text-muted-foreground italic">
                            {t("consumableForm.list.empty")}
                        </p>
                    </div>
                ) : (
                    selectedItems.map((item) => (
                        <ConsumableItemRow
                            key={item.id}
                            item={item}
                            quantity={currentQuantities[item.id]}
                            onRemove={onRemoveItem}
                            onQuantityChange={(id, val) => onQuantityChange(id, typeof val === "string" ? Number(val) : val)}
                            onQuantityBlur={(id, val) => onQuantityBlur(id, item, val)}
                        />
                    ))
                )}
            </div>

            <div className="p-3 border-t border-border bg-muted/40 flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>{t("consumableForm.footer.methodLabel")}</span>
                <span className="font-semibold text-muted-foreground">{t("consumableForm.footer.methodValue")}</span>
            </div>
        </div>
    );
};