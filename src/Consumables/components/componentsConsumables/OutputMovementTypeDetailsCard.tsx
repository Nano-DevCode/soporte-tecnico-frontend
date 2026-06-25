import React, { useMemo, type JSX } from "react";
import { Controller, type Control, type FieldErrors, type UseFormWatch } from "react-hook-form";
import { AlertCircle, Layers3, ClipboardList, Layers, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CatalogSelector } from "../CatalogSelector";

// 1. Interfaces base del formulario
interface CatalogOption {
    id: string | number;
    name: string;
}

interface ApplicationButton {
    id: 2 | 3 | 4;
    labelKey: "consumableForm.labels.ticket" | "consumableForm.labels.internalUse" | "consumableForm.labels.damagedMaterial";
    icon: JSX.Element;
}

interface OutputFormValues {
    id_movement_type: number | string;
    id_movement_aplication: number;
    selectedTicket: CatalogOption | null;
    selectedDepartment: CatalogOption | null;
    observations: string;
    quantities: Record<string, number>;
}

// 2. Definición exacta de Props usando "any" seguro o importando el tipo si lo prefieres
interface ConsumableDetailsFormCardProps {
    control: Control<OutputFormValues>;
    watch: UseFormWatch<OutputFormValues>;
    errors: FieldErrors<OutputFormValues>;
    ticketsHook: React.ComponentProps<typeof CatalogSelector>["hookResult"];
    departmentsHook: React.ComponentProps<typeof CatalogSelector>["hookResult"];
    isSubmitting: boolean;
    isItemsEmpty: boolean;
    onApplicationChange: (targetId: number) => void;
    onCancel: () => void;
}

const APPLICATION_BUTTONS_BASE: ReadonlyArray<ApplicationButton> = [
    { id: 2, labelKey: "consumableForm.labels.ticket", icon: <ClipboardList className="w-4 h-4" /> },
    { id: 3, labelKey: "consumableForm.labels.internalUse", icon: <Layers className="w-4 h-4" /> },
    { id: 4, labelKey: "consumableForm.labels.damagedMaterial", icon: <AlertCircle className="w-4 h-4" /> },
];

export const ConsumableDetailsFormCard: React.FC<ConsumableDetailsFormCardProps> = ({
    control,
    watch,
    errors,
    ticketsHook,
    departmentsHook,
    isSubmitting,
    isItemsEmpty,
    onApplicationChange,
    onCancel,
}) => {
    const { t } = useTranslation();
    const applicationId = watch("id_movement_aplication");

    // Memorización de reglas de validación
    const observationsRules = useMemo(() => ({
        required: applicationId !== 2 ? t("consumableForm.errors.justificationRequired") : false
    }), [applicationId, t]);

    const ticketRules = useMemo(() => ({
        required: t("consumableForm.errors.ticketRequired")
    }), [t]);

    return (
        <div className="rounded-xl border-2 bg-card p-5 sm:p-6 shadow-sm space-y-2">
            {/* Encabezado */}
            <div className="flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-blue-700 shrink-0" />
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t("consumableForm.details.title")}
                </h3>
            </div>
            <div>
                <p className="text-sm text-muted-foreground mt-1">
                    {t("consumableForm.details.description")}
                </p>
            </div>

            {/* Selector de Aplicación */}
            <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
                    {t("consumableForm.details.applicationQuestion")} <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-muted p-1 rounded-lg border border-border/60">
                    {APPLICATION_BUTTONS_BASE.map((btn) => {
                        const isSelected = applicationId === btn.id;
                        return (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => onApplicationChange(btn.id)}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                                    isSelected
                                        ? "bg-background text-foreground shadow-sm border border-border/20 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                            >
                                {btn.icon}
                                {t(btn.labelKey)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Campos Dinámicos */}
            <div className="space-y-4 pt-4 border-t border-border/60">
                {/* Selector de Tickets condicional */}
                {applicationId === 2 && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
                            {t("consumableForm.details.ticketLabel")} <span className="text-destructive">*</span>
                        </label>
                        <Controller
                            name="selectedTicket"
                            control={control}
                            rules={ticketRules}
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
                        {errors.selectedTicket?.message && (
                            <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                <AlertCircle size={13} /> {errors.selectedTicket.message}
                            </span>
                        )}
                    </div>
                )}

                {/* Selector de Departamento */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
                        {t("consumableForm.details.departmentLabel", {
                            context: applicationId === 2 ? "optional" : "default"
                        })}
                    </label>
                    <Controller
                        name="selectedDepartment"
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                hookResult={departmentsHook}
                                value={field.value}
                                onChange={field.onChange}
                                allowCreate={false}
                                placeholder={t("consumableForm.details.departmentPlaceholder")}
                            />
                        )}
                    />
                    {errors.selectedDepartment?.message && (
                        <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                            <AlertCircle size={13} /> {errors.selectedDepartment.message}
                        </span>
                    )}
                </div>

                {/* Área de Observaciones */}
                <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
                        {t("consumableForm.details.observationsLabel")}
                        {applicationId !== 2 && <span className="text-destructive"> *</span>}
                        {applicationId === 2 && (
                            <span className="text-muted-foreground font-normal lowercase italic">
                                {" "}
                                ({t("consumableForm.details.optional")})
                            </span>
                        )}
                    </label>

                    <Controller
                        name="observations"
                        control={control}
                        rules={observationsRules}
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
                                className={`w-full p-3 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-24 resize-none transition-all shadow-sm ${
                                    errors.observations ? "border-destructive focus-visible:ring-destructive" : "border-input"
                                }`}
                            />
                        )}
                    />

                    {errors.observations?.message && (
                        <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                            <AlertCircle size={13} /> {errors.observations.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border w-full">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="w-full sm:w-auto h-11 px-5 text-sm font-medium flex items-center justify-center gap-2"
                >
                    <X size={15} />
                    {t("consumableForm.details.cancel")}
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || isItemsEmpty}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-11 px-5 text-sm font-semibold rounded-lg shadow-sm"
                >
                    <Save size={16} />
                    {t("consumableForm.details.submitButton")}
                </Button>
            </div>
        </div>
    );
};