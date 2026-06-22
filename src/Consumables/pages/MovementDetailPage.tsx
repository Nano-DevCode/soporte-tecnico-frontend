import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { getMovementConsumableByIdAction } from "../actions/get-movement-consumables.actions";
import { Button } from "@/components/ui/button";
import { MovementDetailView } from "../components/CustomMovementDetailView";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { Loader2 } from "lucide-react";

export const MovementDetailPage = () => {
    const { code_movement_aplication } = useParams<{ code_movement_aplication: string }>();
    const navigate = useNavigate();

    const { data: movement, isLoading } = useQuery({
        queryKey: ["consumable-movement-detail", code_movement_aplication],
        queryFn: async () => {
            if (!code_movement_aplication) return null;
            return await getMovementConsumableByIdAction(code_movement_aplication);
        },
        enabled: !!code_movement_aplication,
        staleTime: 10000,
    });

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex flex-col gap-2 items-center justify-center min-h-[400px] text-muted-foreground text-sm">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span>{t("movementDetail.loading")}</span>
            </div>
        );
    }

    if (!movement) {
        return (
            <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground max-w-xl mx-auto mt-12 space-y-4">
                <p className="text-base font-medium">
                    {t("movementDetail.notFound", { code: code_movement_aplication })}
                </p>
                <Button onClick={() => navigate("/consumable-movements")} variant="outline">
                    {t("movementDetail.btnBack")}
                </Button>
            </div>
        );
    }

    // Retorna la vista inyectándole la data exacta recuperada del backend
    return (
        <div className="w-full space-y-4">
            <CustomBackToList onBack={() => navigate("/consumable-movements")} backLabel={t("movementDetail.backLabel")} />
            <MovementDetailView movement={movement} />
        </div>
    );
};