import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
import type { EquipmentPayload } from "../actions/post-equipment.action";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";
import { CanAction } from "@/Consumables/permissions/Can";

export const UpdateEquipmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { updateEquipmentAsync, isUpdating } = useEquipments();

    const { data: equipment, isLoading, isError } = useQuery({
        queryKey: ["equipment", id],
        queryFn: () => getEquipmentByIdAction(id!),
        enabled: !!id,
        retry: 1,
        placeholderData: (previousData) => previousData,
    });

    const handleUpdate = async (formData: EquipmentPayload) => {
        if (!id) return;

        // Quitamos el "return" inicial para permitir que el flujo continúe tras el éxito
        await sileo.promise(
            updateEquipmentAsync({
                id,
                payload: formData
            }),
            {
                loading: {
                    title: t("eq_update_loading_title"),
                    description: t("eq_update_loading_desc")
                },
                success: {
                    title: t("eq_update_success_title"),
                    description: t("eq_update_success_desc"),
                    duration: 4000
                },
                error: (err) => {
                    let backendMessage = t("eq_update_error_unexpected");

                    const errorObj = err as Record<string, unknown>;
                    if (errorObj && errorObj.message && typeof errorObj.message === "string") {
                        backendMessage = errorObj.message;
                    }
                    else if (errorObj && Array.isArray(errorObj.message)) {
                        backendMessage = errorObj.message.join(", ");
                    }
                    else if (isAxiosError(err) && err.response?.data) {
                        const msg = err.response.data.message;
                        backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                    }

                    return {
                        title: t("eq_update_error_title"),
                        description: backendMessage,
                        duration: 6000
                    };
                }
            }
        );
        navigate("/equipments");
    };

    if (isLoading && !equipment) {
        return (
            <CanAction permission="EDIT_EQUIPMENT">
                <div className="flex flex-col items-center justify-center min-h-400px">
                    <Loader2 className="animate-spin mb-2 text-primary" size={40} />
                    <p className="font-medium text-muted-foreground">{t("eq_update_fetching_info")}</p>
                </div>
            </CanAction>
        );
    }

    if (isError || !equipment) {
        return (

            <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <h2 className="text-red-800 font-bold text-xl mb-2">{t("eq_update_not_found_title")}</h2>
                <p className="text-red-600/80 mb-6">{t("eq_update_not_found_desc")}</p>
                <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
                    {t("eq_update_back_list_btn")}
                </Button>
            </div>
        );
    }

    return (
        <CanAction permission="EDIT_EQUIPMENT">
            <div className="p-8 space-y-6">
                <CustomBackToList
                    onBack={() => navigate('/equipments')}
                    backLabel={t("eq_update_back_list_btn")}
                    actionUrl="equipments"
                />

                <EquipmentForm
                    onSubmit={handleUpdate}
                    isSubmitting={isUpdating}
                    initialData={equipment}
                    mode="update"
                />
            </div>
        </CanAction>
    );
};