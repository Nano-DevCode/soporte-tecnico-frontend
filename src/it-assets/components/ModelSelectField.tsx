import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsModels } from "../hooks/useItAssetsModels";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { useTranslation } from "react-i18next";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { isAxiosError } from "axios";

export const ModelSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const selectedBrandId = watch("brandId");
  const [prevBrand, setPrevBrand] = useState(selectedBrandId);

  // Evitamos que al cargar los datos en modo edición se borre el modelo automáticamente
  if (selectedBrandId !== prevBrand) {
    setPrevBrand(selectedBrandId);
    // Si el cambio de marca es manual (no la carga inicial), reseteamos el modelo
    if (prevBrand) {
      setValue("modelId", "");
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { itAssetsModels, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createModel, isCreating } = useItAssetsModels(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsModels.map(model => ({ id: model.id, name: model.name }));
  }, [itAssetsModels]);

  const isFieldDisabled = disabled || isCreating || !selectedBrandId;

  return (
    <FormField
      control={control}
      name="modelId"
      render={({ field }) => {
        const selectedOption = options.find(opt => opt.id === field.value) || (field.value === initialData?.id ? initialData : null);

        return (
          <FormItem className="w-full">
            <FormLabel>{t("itAssets.components.modelSelectField.label")} <span className="text-red-500">*</span></FormLabel>
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
                placeholder={selectedBrandId ? t("itAssets.components.modelSelectField.placeholder") : t("itAssets.components.modelSelectField.placeholderDisabled")}
                disabled={isFieldDisabled}
                allowCreate={!!selectedBrandId} 
                onCreate={async (newItemName) => {
                  if (!selectedBrandId) return;
                  try {
                    const newModel = await sileo.promise(createModel({ name: newItemName, brandId: selectedBrandId }), {
                      loading: { title: t("itAssets.components.modelSelectField.sileo.loading.title", { name: newItemName }) },
                      success: { title: t("itAssets.components.modelSelectField.sileo.success.title") },
                      error: (err) => {
                        let backendMessage = t("itAssets.components.modelSelectField.sileo.error.defaultMessage");
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: t("itAssets.components.modelSelectField.sileo.error.title"),
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    field.onChange(newModel.id);
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