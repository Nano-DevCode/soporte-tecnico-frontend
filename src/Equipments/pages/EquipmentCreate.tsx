import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useNavigate } from "react-router";
import type { EquipmentPayload } from "../actions/post-equipment.action";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { t } from "i18next";

export const CreateEquipmentPage = () => {
    const navigate = useNavigate();
    const { createEquipmentAsync, isCreating } = useEquipments();

    const handleFormSubmit = async (formData: EquipmentPayload) => {
        await sileo.promise(createEquipmentAsync(formData), {
            loading: {
                title: t("eq_create_page_toast_loading_title"),
                description: t("eq_create_page_toast_loading_desc")
            },
            success: {
                title: t("eq_create_page_toast_success_title"),
                description: t("eq_create_page_toast_success_desc"),
                duration: 4000
            },
            error: (err) => {
                let backendMessage = t("eq_create_page_toast_error_default");

                if (isAxiosError(err) && err.response?.data) {
                    const msg = err.response.data.message;
                    backendMessage = Array.isArray(msg) ? msg.join(", ") : msg;
                }

                return {
                    title: t("eq_create_page_toast_error_title"),
                    description: backendMessage, 
                    duration: 6000
                };
            }
        });

        navigate("/equipments");
    };  

    return (
        <div className="">
            <CustomBackToList
                onBack={() => navigate('/equipments')}
                backLabel={t("eq_create_page_back_label")}
                actionUrl="equipments"
            />

            <EquipmentForm
                onSubmit={handleFormSubmit}
                isSubmitting={isCreating}
                mode={"create"}
            />
        </div>
    );
};