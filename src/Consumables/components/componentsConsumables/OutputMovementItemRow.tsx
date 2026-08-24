import { Trash2, Tag, Box } from "lucide-react";
import { t } from "i18next";
import type { Consumable } from "@/Consumables/interfaces/consumable.interfaces";

interface ConsumableItemRowProps {
    item: Consumable;
    quantity: number | string;
    onRemove: (id: string) => void;
    onQuantityChange: (id: string, value: number | string) => void;
    onQuantityBlur: (id: string, value: number | string) => void;
};

export const ConsumableItemRow: React.FC<ConsumableItemRowProps> = ({
    item,
    quantity,
    onRemove,
    onQuantityChange,
    onQuantityBlur
}) => {
    const currentNum = Number(quantity) || 1;

    return (
        <div className="p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1 space-y-0.5" title={item.description}>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">
                        {item.item_code || "N/A"}
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground line-clamp-2">
                        {item.name}
                    </span>
                </div>

                <div className="flex items-start gap-2 shrink-0">
                    {/* SOLUCIÓN ACCESIBILIDAD: react-doctor requería un aria-label explícito para lectores de pantalla */}
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="p-2 h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive active:bg-destructive/20 transition-colors"
                        aria-label={t("consumableForm.list.removeTooltip") || "Eliminar consumible de la lista"}
                    >
                        <Trash2 size={16} />
                    </button>

                    <div className="flex flex-col items-end gap-1">
                        <div className={`flex items-center bg-background border rounded-lg shadow-sm overflow-hidden h-9 transition-colors ${item.available_stock <= 0 ? "border-destructive/40 bg-destructive/5" : "border-input focus-within:ring-1 focus-within:ring-ring"}`}>
                            <button
                                type="button"
                                disabled={item.available_stock <= 0 || currentNum <= 1}
                                onClick={() => {
                                    if (currentNum > 1) onQuantityChange(item.id, currentNum - 1);
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
                                value={quantity ?? (item.available_stock > 0 ? 1 : 0)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        onQuantityChange(item.id, "");
                                        return;
                                    }
                                    let num = parseInt(val, 10);
                                    if (isNaN(num) || num < 1) num = 1;
                                    if (num > item.available_stock) num = item.available_stock;
                                    onQuantityChange(item.id, num);
                                }}
                                onBlur={() => onQuantityBlur(item.id, quantity)}
                                className={`w-12 bg-transparent text-center text-sm font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${item.available_stock <= 0 ? "text-destructive opacity-50" : "text-foreground"}`}
                            />

                            <button
                                type="button"
                                disabled={item.available_stock <= 0 || currentNum >= item.available_stock}
                                onClick={() => {
                                    if (currentNum < item.available_stock) onQuantityChange(item.id, currentNum + 1);
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
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${item.available_stock < 1 ? "bg-destructive/5 text-destructive border-destructive/25" : "bg-muted text-foreground border-border"}`}>
                    <Box size={12} />
                    {t("consumableForm.list.stockLabel", { count: item.available_stock })}
                </span>
            </div>
        </div>
    );
};