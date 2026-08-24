import { useParams, useNavigate } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";
import { useEffect } from "react";
import { t } from "i18next";
import { sileo } from "sileo";
import { ConsumableFields } from "../components/CustomConsumableForm";
import { useConsumablesCreateUpdate, useConsumable } from "../hooks/useConsumableCreate";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { handleBackendErrors } from "../utils/handleBackendErrors";
import { Loader2 } from "lucide-react";
import { CanAction } from "../permissions/Can";

export const ConsumableEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { updateConsumableAsync, isUpdating } = useConsumablesCreateUpdate();
    const { consumable, isLoading } = useConsumable();

    const { register, control, handleSubmit, setValue, setError, watch, reset, formState: { errors } } = useForm<FieldValues>();

    useEffect(() => {
        if (consumable) {
            reset({
                consumable: {
                    name: consumable.name,
                    description: consumable.description,
                    stockMin: consumable.stockMin,
                    stockMax: consumable.stockMax,
                    id_type_consumable: consumable.id_type_consumable,
                    id_brand_consumable: consumable.id_brand_consumable,
                    id_ubication_consumable: consumable.id_ubication_consumable,
                    id_unit_measurement: consumable.id_unit_measurement,
                    number_uses: consumable.number_uses,
                    imageUrl: consumable.imageUrl,
                },
            });
        }
    }, [consumable, reset]);

    const onSubmit = async (data: FieldValues) => {
        if (!id) return;
        const c = data.consumable;

        const typeId = c.id_type_consumable?.id ?? c.id_type_consumable;
        const brandId = c.id_brand_consumable?.id ?? c.id_brand_consumable;
        const ubicationId = c.id_ubication_consumable?.id ?? c.id_ubication_consumable;
        const unitId = c.id_unit_measurement?.id ?? c.id_unit_measurement;
        const uses = Number(unitId) === 1 ? Number(c.number_uses) : 1;

        const formData = new FormData();
        formData.append("name", c.name.trim());
        formData.append("description", c.description.trim());
        formData.append("stockMin", c.stockMin);
        formData.append("stockMax", c.stockMax);
        formData.append("id_type_consumable", String(typeId));
        formData.append("id_brand_consumable", String(brandId));
        formData.append("id_ubication_consumable", String(ubicationId));
        formData.append("id_unit_measurement", String(unitId));
        formData.append("number_uses", String(uses));

        if (c.imageUrl instanceof FileList && c.imageUrl.length > 0) {
            formData.append("file", c.imageUrl[0]);
        }

        try {
            await sileo.promise(updateConsumableAsync({ id, payload: formData }), {
                loading: { title: t("consumableEdit.loadingTitle") },
                success: { title: t("consumableEdit.successTitle") },
                error: (err) => {
                    let dynamicDescription = t("consumableEdit.dynamicErrorDesc");

                    handleBackendErrors(
                        err,
                        setError,
                        [
                            { backendKeyword: "name", fieldPath: "consumable.name" },
                            { backendKeyword: "description", fieldPath: "consumable.description" },
                            { backendKeyword: "stockMin", fieldPath: "consumable.stockMin" },
                            { backendKeyword: "stockMax", fieldPath: "consumable.stockMax" },
                            { backendKeyword: "type", fieldPath: "consumable.id_type_consumable" },
                            { backendKeyword: "brand", fieldPath: "consumable.id_brand_consumable" },
                            { backendKeyword: "ubication", fieldPath: "consumable.id_ubication_consumable" },
                            { backendKeyword: "measurement", fieldPath: "consumable.id_unit_measurement" },
                            { backendKeyword: "uses", fieldPath: "consumable.number_uses" }
                        ],
                        (cleanMessage) => {
                            dynamicDescription = cleanMessage;
                        }
                    );

                    return {
                        title: t("consumableEdit.errorTitle"),
                        description: dynamicDescription,
                        duration: 8000
                    };
                },
            });
            navigate("/consumables");
        } catch (e) {
            void e;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin mb-2 text-emerald-600" size={40} />
                <p className="text-zinc-500 text-sm">{t("consumableEdit.loadingData")}</p>
            </div>
        );
    }

    return (
        <CanAction permission="EDIT_CONSUMABLE">
            <div className="w-full space-y-4">
                <CustomBackToList onBack={() => navigate("/consumables")} backLabel={t("consumableEdit.backLabel")} />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <ConsumableFields
                        control={control}
                        register={register}
                        setValue={setValue}
                        disabled={isUpdating}
                        errors={errors}
                        watch={watch}
                        mode="update"
                        initialData={consumable ? { imageUrl: consumable.imageUrl } : undefined}
                        onCancel={() => navigate("/consumables")}
                    />
                </form>
            </div>
        </CanAction>
    );
};