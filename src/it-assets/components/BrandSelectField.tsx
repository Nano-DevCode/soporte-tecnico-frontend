import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsBrands } from "../hooks/useItAssetsBrands";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { isAxiosError } from "axios";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const BrandSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
  const { control } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { itAssetsBrands, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createBrand, isCreating } = useItAssetsBrands(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsBrands.map(brand => ({ id: brand.id, name: brand.name }));
  }, [itAssetsBrands]);

  return (
    <FormField
      control={control}
      name="brandId"
      render={({ field }) => {
        const selectedOption = options.find(opt => opt.id === field.value) || (field.value === initialData?.id ? initialData : null);

        return (
          <FormItem className="w-full">
            <FormLabel>Marca <span className="text-red-500">*</span></FormLabel>
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
                placeholder="Buscar o crear marca..."
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newBrand = await sileo.promise(createBrand({ name: newItemName }), {
                      loading: { title: `Creando marca "${newItemName}"...` },
                      success: { title: "Marca creada"  },
                      error: (err) => {
                        let backendMessage = "Error al crear la marca";
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: "Error",
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    field.onChange(newBrand.id);
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