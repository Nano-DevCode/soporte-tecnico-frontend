import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsModels } from "../hooks/useItAssetsModels";
import { InfiniteScrollSelect } from "@/Equipments/components/infinite-scroll-select";
import { sileo } from "sileo";

export const ModelSelectField = ({ disabled }: { disabled?: boolean }) => {
  const { control, watch, setValue } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 1. OBSERVAMOS EL ID DE LA MARCA SELECCIONADA EN EL FORMULARIO
  const selectedBrandId = watch("brandId");

  // 2. SI LA MARCA CAMBIA, LIMPIAMOS EL MODELO (Para que no envíen un modelo de otra marca)
  useEffect(() => {
    setValue("modelId", "");
  }, [selectedBrandId, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { 
    itAssetsModels, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createModel, isCreating
  } = useItAssetsModels(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsModels.map(model => ({ id: model.id, name: model.name }));
  }, [itAssetsModels]);

  // 3. BLOQUEAMOS SI SE ESTÁ GUARDANDO EL FORMULARIO, SI SE ESTÁ CREANDO EL MODELO O SI NO HAY MARCA
  const isFieldDisabled = disabled || isCreating || !selectedBrandId;

  return (
    <FormField
      control={control}
      name="modelId"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Modelo <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <InfiniteScrollSelect
              options={options}
              value={options.find(opt => opt.id === field.value) || null}
              onChange={(val) => field.onChange(val?.id || "")}
              onSearch={setSearchInput}
              fetchNextPage={fetchNextPage}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isLoading={isLoading}
              // 4. PLACEHOLDER DINÁMICO
              placeholder={selectedBrandId ? "Buscar o crear modelo..." : "Selecciona una marca primero"}
              disabled={isFieldDisabled}
              // 5. SOLO PERMITIMOS CREAR SI HAY UNA MARCA SELECCIONADA
              allowCreate={!!selectedBrandId} 
              onCreate={async (newItemName) => {
                if (!selectedBrandId) return; // Doble validación de seguridad
                try {
                  const newModel = await sileo.promise(
                    createModel({ name: newItemName, brandId: selectedBrandId }), // Pasamos el BrandId
                    {
                      loading: { title: `Creando modelo "${newItemName}"...` },
                      success: { title: "Modelo creado exitosamente" },
                      error: { title: "Error al crear el modelo" }
                    }
                  );
                  field.onChange(newModel.id);
                  setSearchInput("");
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};