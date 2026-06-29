import React, { useState, useEffect } from "react"; // 1. Agregamos useEffect
import { useForm, useFieldArray, type UseFormSetError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Layers, FileText, Info, X, Save } from "lucide-react";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateBatchProductPayload } from "../actions/post-batches-consumables.action";
import { t } from "i18next";

import { BatchItemRow } from "./componentsConsumables/BatchItemRow"; 
import { BatchConfirmationDialog } from "./componentsConsumables/BatchConfirmationDialog";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";

export interface Props {
    bagConsumables: Consumable[];
    isSubmitting: boolean;
    onSubmit: (data: CreateBatchProductPayload, setErrorForm?: UseFormSetError<CreateBatchProductPayload>) => void;
    onRemoveItem: (id: string) => void;
    onCancel: () => void;
}

const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
    const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
    return `${backendBaseUrl}/${cleanUrl}`;
};

const returnFormattedCurrency = (val: string | number | undefined) => {
    return Number(val || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const isValidDraft = (value: unknown): value is CreateBatchProductPayload => {
    return (
        typeof value === "object" &&
        value !== null &&
        "items" in value &&
        Array.isArray((value).items)
    );
};

export const CreateBatchForm: React.FC<Props> = ({
    bagConsumables,
    isSubmitting,
    onSubmit,
    onRemoveItem,
    onCancel
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<CreateBatchProductPayload | null>(null);
    const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);
    
    const { saveFormDraft, getFormDraft: getFormDraftStorage } = useConsumableBagStore();
    
    const initialItems = React.useMemo(() => {
        const savedDraft = getFormDraftStorage();
        const validDraft = isValidDraft(savedDraft) ? savedDraft : null;

        return bagConsumables.map((c) => {
            const historicalItem = validDraft?.items?.find(item => item.id_consumable === c.id);
            return {
                id_consumable: c.id,
                arrival_amount: historicalItem ? historicalItem.arrival_amount : 1,
                cost_batch: historicalItem ? historicalItem.cost_batch : 0,
            };
        });
    }, [bagConsumables, getFormDraftStorage]);

    const initialNumRequirement = React.useMemo(() => {
        const savedDraft = getFormDraftStorage();
        return isValidDraft(savedDraft) ? savedDraft.num_requirement : "";
    }, [getFormDraftStorage]);

    const { register, control, handleSubmit, setValue, watch, formState: { errors }, setError } = useForm<CreateBatchProductPayload>({
        values: {
            num_requirement: initialNumRequirement,
            items: initialItems
        }
    });

    const { fields } = useFieldArray({ control, name: "items" });
    
    // Escuchamos los cambios del formulario nativamente a través de la suscripción de watch
    const formValues = watch(); 
    const watchedItems = formValues.items || [];
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (formValues) {
                saveFormDraft(formValues as unknown as Consumable);
            }
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [formValues, saveFormDraft]);

    const handlePreSubmit = (data: CreateBatchProductPayload) => {
        setPendingData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isLoading || !pendingData) return;
        setIsLocalSubmitting(true);
        try {
            await onSubmit(pendingData, setError);
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error capturado,", error);
        } finally {
            setIsLocalSubmitting(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsConfirmOpen(open);
        if (!open) {
            setIsLocalSubmitting(false);
        }
    };

    const isLoading = isSubmitting || isLocalSubmitting;

    return (
        <>
            {/* Eliminamos el onChange destructivo de aquí */}
            <form 
                onSubmit={handleSubmit(handlePreSubmit)} 
                className="w-full space-y-6"
            >
                {/* SECCIÓN DETALLE: Lista de Productos */}
                <div className="rounded-xl bg-card border shadow-sm w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 p-5 px-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                                    {t("createBatchForm.title")}
                                </CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">{t("createBatchForm.description")}</p>
                        </div>
                        <span className="w-fit bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40 shrink-0 self-start sm:self-center">
                            {fields.length} {fields.length === 1 ? t("createBatchForm.badgeSingle") : t("createBatchForm.badgePlural")}
                        </span>
                    </div>

                    <CardContent className="p-0">
                        <div className="px-4 border-b border-border/60 space-y-2 bg-muted/20 w-full mt-0 pb-3">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground pt-3">
                                <Info size={14} className="text-orange-500 shrink-0" />
                                <span>{t("createBatchForm.notes.title")}</span>
                            </div>
                            <ul className="space-y-2 p-2 text-sm text-muted-foreground leading-relaxed">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-orange-500 font-medium select-none">•</span>
                                    <span>
                                        {t("createBatchForm.notes.bodyBefore")}{" "}
                                        <strong className="font-semibold text-foreground">{t("createBatchForm.notes.bodyBold")}</strong>{" "}
                                        {t("createBatchForm.notes.bodyAfter")}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Cabecera Desktop */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-border/60 text-xs uppercase font-bold tracking-wider items-center">
                            <div className="md:col-span-6">{t("createBatchForm.table.headerInfo")}</div>
                            <div className="md:col-span-3 text-center">{t("createBatchForm.table.headerAmount")}</div>
                            <div className="md:col-span-2 text-center">{t("createBatchForm.table.headerCost")}</div>
                            <div className="md:col-span-1 text-center">{t("createBatchForm.table.headerActions")}</div>
                        </div>

                        {/* Contenedor de Filas mapeadas */}
                        <div className="divide-y divide-border/50">
                            {fields.map((field, index) => {
                                const consumable = bagConsumables.find((c) => c.id === field.id_consumable);
                                if (!consumable) return null;

                                return (
                                    <BatchItemRow
                                        key={field.id}
                                        field={field}
                                        index={index}
                                        consumableInfo={consumable}
                                        imgUrl={getFullImageUrl(consumable.imageUrl)}
                                        currentAmount={watchedItems[index]?.arrival_amount ?? 1}
                                        itemErrors={errors.items?.[index]}
                                        isLoading={isLoading}
                                        isConfirmOpen={isConfirmOpen}
                                        register={register}
                                        setValue={setValue}
                                        onRemoveItem={onRemoveItem}
                                    />
                                );
                            })}
                        </div>
                    </CardContent>
                </div>

                {/* SECCIÓN INFERIOR: Requerimiento y Controles */}
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
                                    disabled={isLoading || isConfirmOpen}
                                    {...register("num_requirement", {
                                        required: t("createBatchForm.validation.reqRequired"),
                                        minLength: { value: 3, message: t("createBatchForm.validation.reqMinLength") }
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
                                disabled={isLoading || isConfirmOpen}
                                className="w-full sm:w-auto px-5 font-bold uppercase tracking-wider h-10 text-xs rounded-lg flex items-center justify-center gap-2 border-slate-200 dark:bg-zinc-700 bg-white text-slate-900 dark:text-white hover:bg-slate-50 shadow-sm transition-colors"
                            >
                                <X className="h-4 w-4 " />
                                {t("createBatchForm.actions.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || isConfirmOpen}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm w-full sm:w-auto px-6 h-10 text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                <Save className="h-4 w-4 shrink-0" />
                                {t("createBatchForm.actions.submit")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <BatchConfirmationDialog
                isOpen={isConfirmOpen}
                onOpenChange={handleOpenChange}
                isLoading={isLoading}
                pendingData={pendingData}
                bagConsumables={bagConsumables}
                fieldsLength={fields.length}
                onConfirm={handleConfirmSubmit}
                formatCurrency={returnFormattedCurrency}
            />
        </>
    );
};