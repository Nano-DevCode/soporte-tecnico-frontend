import { useState, useEffect, useMemo, useRef } from "react";
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

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (text: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 500);
  };

  const selectedBrandId = watch("brandId");
  
  const prevBrandRef = useRef(selectedBrandId);
  useEffect(() => {
    if (prevBrandRef.current && selectedBrandId !== prevBrandRef.current) {
      setValue("modelId", "");
    }
    prevBrandRef.current = selectedBrandId;
  }, [selectedBrandId, setValue]);

  useEffect(() => {
    const timer = searchTimerRef;
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

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
                onSearch={handleSearch}
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
                    
                    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                    setDebouncedSearch("");
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