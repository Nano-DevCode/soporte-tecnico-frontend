import { useNavigate } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";
import { t } from "i18next";
import { sileo } from "sileo";
import { useConsumablesCreateUpdate } from "../hooks/useConsumableCreate";
import { ConsumableFields } from "../components/CustomConsumableForm";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { getConsumableBagIds, saveConsumableBagIds } from "../utils/bagStorage";
import { handleBackendErrors } from "../utils/handleBackendErrors";
import { CanAction } from "../permissions/Can";

export const ConsumableCreatePage = () => {
    const navigate = useNavigate();
    const { createConsumableAsync, isCreating } = useConsumablesCreateUpdate();

    const { register, control, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            consumable: {
                name: "",
                description: "",
                stockMin:0,
                stockMax:0,
                id_type_consumable: null,
                id_brand_consumable: null,
                id_ubication_consumable: null,
                id_unit_measurement: null,
                number_uses: 1,
                imageUrl: null,
            },
        },
    });

    const onSubmit = async (data: FieldValues) => {
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

        if (c.imageUrl && c.imageUrl instanceof FileList && c.imageUrl.length > 0) {
            formData.append("file", c.imageUrl[0]);
        }

        try {
            // Sileo resolverá o lanzará el error al flujo del catch
            const createdItem = await sileo.promise(
                createConsumableAsync(formData),
                {
                    loading: { title: t("consumableCreate.loadingTitle") },
                    success: { title: t("consumableCreate.successTitle") },
                    error: (err) => {
                        let dynamicDescription = t("consumableCreate.dynamicErrorDesc");

                        // Usamos handleBackendErrors para mapear errores directo a los inputs de React Hook Form
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
                                { backendKeyword: "uses", fieldPath: "consumable.number_uses" },
                                { backendKeyword: "file", fieldPath: "consumable.imageUrl" }, // <-- Mapea errores de archivo del backend al input de la imagen
                                { backendKeyword: "image", fieldPath: "consumable.imageUrl" }
                            ],
                            // El callback nos devuelve el string limpio procesado por la utilidad
                            (cleanMessage) => {
                                dynamicDescription = cleanMessage;
                            }
                        );

                        //Retornamos la configuración del Toast a Sileo con el mensaje exacto
                        return {
                            title: t("consumableCreate.errorTitle"),
                            description: dynamicDescription,
                            duration: 8000
                        };
                    }
                }
            );

            // Si todo sale bien, procesamos la bolsa y navegamos
            if (createdItem && createdItem.id) {
                const currentIds = getConsumableBagIds();
                const stringId = String(createdItem.id);

                if (!currentIds.includes(stringId)) {
                    saveConsumableBagIds([...currentIds, stringId]);
                }

                navigate("/consumables/batches/create", {
                    state: { autoCreatedId: stringId }
                });
            }

        } catch (e) {
            void e;
        }
    };

    return (
        <CanAction permission="CREATE_CONSUMABLE">
            <div className="w-full space-y-4">
                <CustomBackToList
                    onBack={() => navigate("/consumables")}
                    backLabel={t("consumableCreate.backLabel")}
                />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <ConsumableFields
                        control={control}
                        register={register}
                        setValue={setValue}
                        disabled={isCreating}
                        errors={errors}
                        watch={watch}
                        mode="create"
                        onCancel={() => navigate("/consumables")}
                    />
                </form>
            </div>
        </CanAction>
    );
};