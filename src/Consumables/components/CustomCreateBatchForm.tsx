import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, type UseFormSetError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle, Loader2, Image as ImageIcon, DollarSign, Layers, FileText, Minus, Plus, Info, X, Save } from "lucide-react";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateBatchProductPayload } from "../actions/post-batches-consumables.action";
import { t } from "i18next"

export interface Props {
    bagConsumables: Consumable[];
    isSubmitting: boolean;
    onSubmit: (data: CreateBatchProductPayload, setErrorForm?: UseFormSetError<CreateBatchProductPayload>) => void;
    onRemoveItem: (id: string) => void;
    onCancel: () => void;
}

interface Consumable {
    id: string;
    imageUrl?: string | null;
    name?: string;
    description?: string;
    item_code?: string;
    id_unit_measurement?: {
        id?: string | number;
        name?: string;
    } | null;
    number_uses?: number;
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

    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors }, setError } = useForm<CreateBatchProductPayload>({
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
        const currentNumRequirement = control._formValues.num_requirement || "";

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
                reset({ num_requirement: currentNumRequirement, items: formItems });
            }
        } else {
            if (fields.length > 0) {
                reset({ num_requirement: currentNumRequirement, items: [] });
            }
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
                <div className="rounded-xl border-2 border-zinc-200/75 bg-card shadow-sm w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60">
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 w-full px-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                                        {t("createBatchForm.title")}
                                    </CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t("createBatchForm.description")}
                                </p>
                            </div>

                            <span className="w-fit bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40 shrink-0 self-start sm:self-center">
                                {fields.length} {fields.length === 1 ? t("createBatchForm.badgeSingle") : t("createBatchForm.badgePlural")}
                            </span>
                        </div>
                    </div>
                    
                    <CardContent className="p-0">
                        {/* NOTAS DE OPERACIÓN */}
                        <div className="px-4 border-b border-border/60 space-y-2 bg-muted/20 w-full mt-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground pt-3">
                                <Info size={14} className="text-orange-500 shrink-0" />
                                <span>{t("createBatchForm.notes.title")}</span>
                            </div>
                            <ul className="space-y-2 p-2 text-sm text-muted-foreground leading-relaxed">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span>
                                        {t("createBatchForm.notes.bodyBefore")}
                                        <strong className="font-semibold text-foreground">
                                            {t("createBatchForm.notes.bodyBold")}
                                        </strong>
                                        {t("createBatchForm.notes.bodyAfter")}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Cabecera de Tabla para Desktop */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-border/60 text-xs uppercase font-bold tracking-wider items-center">
                            <div className="md:col-span-6">{t("createBatchForm.table.headerInfo")}</div>
                            <div className="md:col-span-3 text-center">{t("createBatchForm.table.headerAmount")}</div>
                            <div className="md:col-span-2 text-center">{t("createBatchForm.table.headerCost")}</div>
                            <div className="md:col-span-1 text-center">{t("createBatchForm.table.headerActions")}</div>
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
                                                        alt={consumableInfo?.name || "Consumable"}
                                                        className="h-full w-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="font-semibold text-sm text-foreground line-clamp-2" title={consumableInfo?.name}>
                                                    {consumableInfo?.name || consumableInfo?.description || t("createBatchForm.table.loading")}
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
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border bg-green-50 text-emerald-700 border-emerald-500 dark:bg-emerald-950/30 dark:text-green-400 dark:border-green-900/40">
                                                        {t("createBatchForm.table.usesCount")}: {consumableInfo?.number_uses || "---"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selector Numérico Avanzado */}
                                        <div className="md:col-span-3 space-y-1 md:space-y-0 flex flex-col items-start md:items-center">
                                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block md:hidden">
                                                {t("createBatchForm.table.headerAmount")}
                                            </label>
                                            <div className={`flex items-center border rounded-lg overflow-hidden bg-background h-9 w-full max-w-[140px] shadow-sm ${itemErrors?.arrival_amount ? "border-destructive" : "border-input"}`}>
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
                                                {t("createBatchForm.table.mobileCostLabel")}
                                            </label>
                                            <div className="relative w-full max-w-[140px] md:mx-auto">
                                                <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground/40" />
                                                <Input
                                                    type="number"
                                                    step="0.01"
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
                                                className="h-8 w-auto md:w-8 hover:text-destructive rounded-lg flex items-center justify-center p-2 md:p-0 gap-2 transition-colors text-muted-foreground bg-transparent hover:bg-transparent"
                                                onClick={() => {
                                                    onRemoveItem(field.id_consumable);
                                                    remove(index);
                                                }}
                                                title={t("createBatchForm.table.removeTitle")}
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

                {/* SECCIÓN INFERIOR: Formulario de Control e Identificación */}
                <Card className="bg-card w-full border border-border shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                {t("createBatchForm.form.sectionTitle")}
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pt-1">
                            <div className="space-y-2 flex-1 max-w-xs w-full">
                                <label className="text-xs font-bold block text-foreground uppercase">
                                    {t("createBatchForm.form.inputLabel")} <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    {...register("num_requirement", {
                                        required: t("createBatchForm.validation.reqRequired"),
                                        minLength: {
                                            value: 3,
                                            message: t("createBatchForm.validation.reqMinLength")
                                        }
                                    })}
                                    placeholder={t("createBatchForm.form.placeholder")}
                                    className={`bg-background border-input focus-visible:ring-2 focus-visible:ring-blue-600 h-10 text-sm rounded-lg shadow-sm font-medium ${errors.num_requirement ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                {errors.num_requirement && (
                                    <span className="text-xs font-medium text-destructive block mt-1.5 pl-1">
                                        {errors.num_requirement.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-border/60 pt-5 flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm transition-colors"
                            >
                                <X className="h-4 w-4 shrink-0 text-slate-500" />
                                {t("createBatchForm.actions.cancel")}
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {t("createBatchForm.actions.saving")}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 shrink-0" />
                                        {t("createBatchForm.actions.submit")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* MODAL DE ADVERTENCIA CRÍTICA EN INGRESO */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
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
                                {t("createBatchForm.dialog.descriptionBefore")}
                                <strong className="text-foreground font-semibold">
                                    {t("createBatchForm.dialog.descriptionBold")}
                                </strong>
                                {t("createBatchForm.dialog.descriptionAfter")}
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>

                    {/* MINI TABLA COHERENTE CON MOVIMIENTOS */}
                    <div className="my-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                        <div className="text-xs p-2">
                            {t("createBatchForm.dialog.selectedCount")}: {fields.length}
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
                                            ${Number(item.cost_batch).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                {t("createBatchForm.dialog.footerTotal")}: <span className="text-emerald-600 dark:text-emerald-400">${pendingData?.items.reduce((acc, curr) => acc + (Number(curr.cost_batch) || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </span>
                        </div>
                    </div>

                    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 w-full pt-4 sm:space-x-0 border-t border-border/40 mt-2">
                        <AlertDialogCancel
                            className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm transition-colors mt-0"
                        >
                            <X className="h-4 w-4 shrink-0" />
                            {t("createBatchForm.dialog.actionCancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsConfirmOpen(false);
                                if (pendingData) {
                                    onSubmit(pendingData, setError); 
                                }
                            }}
                            className="bg-orange-500 text-white font-bold uppercase w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2"
                        >
                            <Save className="h-4 w-4 shrink-0" />
                            {t("createBatchForm.dialog.actionConfirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </>
    );
};