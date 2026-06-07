import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsTypes } from "../hooks/useItAssetsTypes";
import { InfiniteScrollSelect } from "@/Equipments/components/infinite-scroll-select";
import { sileo } from "sileo";

export const TypeSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
  const { control } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { itAssetsTypes, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createType, isCreating } = useItAssetsTypes(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsTypes.map(type => ({ id: type.id, name: type.name }));
  }, [itAssetsTypes]);

  return (
    <FormField
      control={control}
      name="typeId"
      render={({ field }) => {
        // Magia para el Update: Si el ID está seleccionado pero no lo encontró en la primera página, usamos initialData
        const selectedOption = options.find(opt => opt.id === field.value) || (field.value === initialData?.id ? initialData : null);

        return (
          <FormItem className="w-full">
            <FormLabel>Tipo de Activo <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <InfiniteScrollSelect
                options={options}
                value={selectedOption || null}
                onChange={(val) => field.onChange(val?.id || "")}
                onSearch={setSearchInput}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                placeholder="Buscar o crear tipo..."
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newType = await sileo.promise(createType({ name: newItemName }), {
                      loading: { title: `Creando tipo "${newItemName}"...` },
                      success: { title: "Tipo creado exitosamente" },
                      error: { title: "Error al crear" }
                    });
                    field.onChange(newType.id);
                    setSearchInput("");
                  } catch (error) { console.error(error); }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  );
};