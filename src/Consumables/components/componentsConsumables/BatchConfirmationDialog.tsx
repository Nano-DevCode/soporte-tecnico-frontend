import React from "react";
import { AlertTriangle, Loader2, Save, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import type { CreateBatchProductPayload } from "@/Consumables/actions/post-batches-consumables.action";
import type { Consumable } from "@/Consumables/interfaces/consumable.interfaces";

interface BatchConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    pendingData: CreateBatchProductPayload | null;
    bagConsumables: Consumable[];
    fieldsLength: number;
    onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
    formatCurrency: (val: string | number) => string;
}

export const BatchConfirmationDialog: React.FC<BatchConfirmationDialogProps> = ({
    isOpen,
    onOpenChange,
    isLoading,
    pendingData,
    bagConsumables,
    fieldsLength,
    onConfirm,
    formatCurrency,
}) => {
    const totalCost = pendingData?.items.reduce((acc, curr) => acc + (Number(curr.cost_batch) || 0), 0) || 0;

    return (
        <AlertDialog open={isOpen} onOpenChange={isLoading ? undefined : onOpenChange}>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-xl rounded-2xl p-6 border border-border shadow-lg bg-card">
                <AlertDialogHeader className="space-y-3">
                    <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground">
                            {t("createBatchForm.dialog.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                            {t("createBatchForm.dialog.descriptionBefore")}{" "}
                            <strong className="text-foreground font-semibold">
                                {t("createBatchForm.dialog.descriptionBold")}
                            </strong>{" "}
                            {t("createBatchForm.dialog.descriptionAfter")}
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>

                {/* Mini Tabla interna */}
                <div className="my-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                    <div className="text-xs p-2 text-muted-foreground">
                        {t("createBatchForm.dialog.selectedCount")}: {fieldsLength}
                    </div>
                    <div className="grid grid-cols-12 bg-muted/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <div className="col-span-6">{t("createBatchForm.dialog.thConsumable")}</div>
                        <div className="col-span-3 text-center">{t("createBatchForm.dialog.thAmount")}</div>
                        <div className="col-span-3 text-right">{t("createBatchForm.dialog.thTotal")}</div>
                    </div>
                    <div className="max-h-[160px] overflow-y-auto divide-y divide-border/60 bg-background">
                        {pendingData?.items.map((item) => {
                            const matchedConsumable = bagConsumables.find(c => c.id === item.id_consumable);
                            return (
                                <div key={item.id_consumable} className="grid grid-cols-12 px-4 py-2.5 items-center text-xs text-foreground transition-colors hover:bg-muted/20">
                                    <div className="col-span-6 pr-2 font-medium truncate" title={matchedConsumable?.description || matchedConsumable?.name}>
                                        {matchedConsumable?.name || matchedConsumable?.description || "---"}
                                    </div>
                                    <div className="col-span-3 text-center font-bold text-zinc-600 dark:text-zinc-400">
                                        {item.arrival_amount}
                                    </div>
                                    <div className="col-span-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                                        ${formatCurrency(item.cost_batch)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-muted/40 px-4 py-2 border-t border-border flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">
                            {t("createBatchForm.dialog.footerReq")}: <strong className="text-foreground font-semibold">{pendingData?.num_requirement}</strong>
                        </span>
                        <span className="font-bold text-foreground">
                            {t("createBatchForm.dialog.footerTotal")}: <span className="text-emerald-600 dark:text-emerald-400">${formatCurrency(totalCost)}</span>
                        </span>
                    </div>
                </div>

                <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 w-full pt-4 sm:space-x-0 border-t border-border/40 mt-2">
                    <AlertDialogCancel asChild>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 text-slate-900 dark:text-white bg-white dark:bg-zinc-800 hover:bg-slate-50 shadow-sm transition-colors mt-0 disabled:opacity-50"
                        >
                            <X className="h-4 w-4 shrink-0" />
                            {t("createBatchForm.dialog.actionCancel")}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            type="button"
                            disabled={isLoading || !pendingData}
                            onClick={onConfirm}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {"Procesando..."}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 " />
                                    {t("createBatchForm.dialog.actionConfirm")}
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};