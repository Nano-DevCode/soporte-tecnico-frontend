import { useParams, useNavigate } from "react-router";
import { t } from "i18next";
import { Loader2, AlertTriangle } from "lucide-react";
import { useConsumableDetails } from "../hooks/useConsumableDetails";
import { ConsumableDetailsView } from "../components/CustomConsumableDetailsView";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { CanAction } from "../permissions/Can";

export default function ConsumableDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Consumimos el hook enviándole el id recuperado de la URL
    const { data: consumable, isLoading, isError, error } = useConsumableDetails(id || "");

    // 1. Estado de carga de datos
    if (isLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm font-medium text-muted-foreground">{t("consumableDetails.loading")}</p>
            </div>
        );
    }

    if (isError || !consumable) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center px-4">
                <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">{t("consumableDetails.errorTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error ? error.message : t("consumableDetails.errorDefault")}
                    </p>
                </div>

                <CustomBackToList onBack={() => navigate("/consumables")} backLabel={t("consumableDetails.backLabel")} />
            </div>
        );
    }

    return (
        <CanAction permission="VIEW_CONSUMABLE_DETAILS">
            <div className="max-w-4xl mx-auto space-y-4">
                <CustomBackToList onBack={() => navigate("/consumables")} backLabel={t("consumableDetails.backLabel")} />
                <ConsumableDetailsView consumable={consumable} />
            </div>
        </CanAction>
    );
}