import React from "react";
import { AlertTriangle, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Consumable } from "@/Consumables/interfaces/consumable.interfaces";

interface MovementConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedItems: Consumable[];
    quantities: Record<string, number>;
    isSubmitting: boolean;
    onConfirm: () => void;
}

export const MovementConfirmDialog: React.FC<MovementConfirmDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedItems,
    quantities,
    isSubmitting,
    onConfirm
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

                    <div className="grid grid-cols-12 gap-2 px-4 py-1.5 bg-muted/20 border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        <div className="col-span-8 sm:col-span-9">{t("consumableForm.dialog.tableHeaderConsumable")}</div>
                        <div className="col-span-4 sm:col-span-3 text-right">{t("consumableForm.dialog.tableHeaderQuantity")}</div>
                    </div>

                    <div className="max-h-40 overflow-y-auto divide-y divide-border/40 text-xs px-4 bg-background scrollbar-thin">
                        {selectedItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 py-2.5 items-center hover:bg-muted/10 transition-colors">
                                <div className="col-span-8 sm:col-span-9 pr-2">
                                    <span className="block truncate font-medium text-foreground" title={item.name}>
                                        {item.name}
                                    </span>
                                </div>
                                <div className="col-span-4 sm:col-span-3 text-right">
                                    <span className="inline-block font-mono bg-muted/80 dark:bg-muted/40 px-2 py-0.5 rounded font-semibold text-foreground text-[11px]">
                                        {quantities[item.id] || 1} u
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 text-slate-900 dark:text-white bg-white dark:bg-zinc-800 hover:bg-slate-50 shadow-sm transition-colors mt-0 disabled:opacity-50"
                    >
                        <X className="h-4 w-4 shrink-0" />
                        {t("consumableForm.dialog.btnReview") || ""}
                    </Button>

                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {"Procesando..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {t("consumableForm.dialog.btnConfirm") || ""}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};