import React from "react";
import { Button } from "@/components/ui/button";
import { X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "i18next";

interface FormActionsProps {
    disabled?: boolean;
    isEditMode: boolean;
    onCancel: () => void;
}

export const ConsumableFormActions: React.FC<FormActionsProps> = ({ disabled, isEditMode, onCancel }) => (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border w-full">
        <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={onCancel}
            className="h-10 px-5 text-sm font-medium"
        >
            <X size={16} className="mr-2" />
            {t("consumables.form.btn_cancel")}
        </Button>
        <Button
            type="submit"
            disabled={disabled}
            className={cn(
                "h-10 px-6 font-semibold text-white min-w-[130px] shadow-sm transition-all active:scale-[0.98]",
                isEditMode ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            )}
        >
            {disabled ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Save size={16} className="mr-2" />
            )}
            {disabled
                ? (isEditMode ? t("consumables.form.btn_updating") : t("consumables.form.btn_saving"))
                : (isEditMode ? t("consumables.form.btn_update") : t("consumables.form.btn_save"))}
        </Button>
    </div>
);