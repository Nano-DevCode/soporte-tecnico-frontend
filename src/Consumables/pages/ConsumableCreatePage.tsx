import { useNavigate } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";
import { sileo } from "sileo";
import { useConsumablesCreateUpdate } from "../hooks/useConsumableCreate";
import { ConsumableFields } from "../components/CustomConsumableForm";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ConsumableCreatePage = () => {
  const navigate = useNavigate();
  const { createConsumableAsync, isCreating } = useConsumablesCreateUpdate();
  
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      consumable: {
        description: "",
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
    formData.append("description", c.description.trim());
    formData.append("id_type_consumable", String(typeId));
    formData.append("id_brand_consumable", String(brandId));
    formData.append("id_ubication_consumable", String(ubicationId));
    formData.append("id_unit_measurement", String(unitId));
    formData.append("number_uses", String(uses));

    if (c.imageUrl && c.imageUrl instanceof FileList && c.imageUrl.length > 0) {
      formData.append("file", c.imageUrl[0]);
    }

    try {
      await sileo.promise(createConsumableAsync(formData), {
        loading: { title: "Guardando consumible..." },
        success: { title: "Consumible registrado con éxito." },
        error: { title: "Ocurrió un error al procesar el alta." }
      });
      navigate("/consumables");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList onBack={() => navigate("/consumables")} backLabel="Lista de Consumibles" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ConsumableFields control={control} register={register} setValue={setValue} disabled={isCreating} errors={errors} watch={watch} mode="create" />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" disabled={isCreating} onClick={() => navigate("/consumables")}>Cancelar</Button>
          <Button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
};