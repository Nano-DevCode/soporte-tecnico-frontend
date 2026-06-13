import { useParams, useNavigate } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";
import { useEffect } from "react";
import { sileo } from "sileo";
import { ConsumableFields } from "../components/CustomConsumableForm";
import { useConsumablesCreateUpdate, useConsumable } from "../hooks/useConsumableCreate";
import { Button } from "@/components/ui/button";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { Loader2 } from "lucide-react";

export const ConsumableEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { updateConsumableAsync, isUpdating } = useConsumablesCreateUpdate();
    const { consumable, isLoading } = useConsumable();

    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>();

    useEffect(() => {
        if (consumable) {
            reset({
                consumable: {
                    description: consumable.description,
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
        formData.append("description", c.description.trim());
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
                loading: { title: "Actualizando consumible..." },
                success: { title: "Cambios guardados con éxito." },
                error: { title: "Error al actualizar la información." },
            });
            navigate("/consumables");
        } catch (e) { console.error(e); }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin mb-2 text-emerald-600" size={40} />
                <p className="text-zinc-500 text-sm">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-4">
            <CustomBackToList onBack={() => navigate("/consumables")} backLabel="Lista de Consumibles" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ConsumableFields
                    control={control}
                    register={register}
                    setValue={setValue}
                    disabled={isUpdating}
                    errors={errors}
                    watch={watch}
                    mode="update"
                    initialData={consumable ? { imageUrl: consumable.imageUrl } : undefined}
                />
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" disabled={isUpdating} onClick={() => navigate("/consumables")}>Cancelar</Button>
                    <Button type="submit" disabled={isUpdating} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Actualizar"}
                    </Button>
                </div>
            </form>
        </div>
    );
};