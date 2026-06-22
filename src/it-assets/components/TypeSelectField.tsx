import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsTypes } from "../hooks/useItAssetsTypes";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { logError } from "@/utils/logger";

export const TypeSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (text: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 500);
  };

  useEffect(() => {
    const stableTimer = searchTimerRef; 
    
    return () => {
      if (stableTimer.current) {
        clearTimeout(stableTimer.current);
      }
    };
  }, []);

  const { itAssetsTypes, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createType, isCreating } = useItAssetsTypes(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsTypes.map(type => ({ id: type.id, name: type.name }));
  }, [itAssetsTypes]);

  return (
    <FormField
      control={control}
      name="typeId"
      render={({ field }) => {
        const selectedOption = options.find(opt => opt.id === field.value) || (field.value === initialData?.id ? initialData : null);

        return (
          <FormItem className="w-full">
            <FormLabel>{t("itAssets.components.typeSelectField.label")} <span className="text-red-500">*</span></FormLabel>
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
                placeholder={t("itAssets.components.typeSelectField.placeholder")}
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newType = await sileo.promise(createType({ name: newItemName }), {
                      loading: { title: t("itAssets.components.typeSelectField.sileo.loading.title", { name: newItemName }) },
                      success: { title: t("itAssets.components.typeSelectField.sileo.success.title") },
                      error: (err) => {
                        let backendMessage = t("itAssets.components.typeSelectField.sileo.error.defaultMessage");
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: t("itAssets.components.typeSelectField.sileo.error.title"),
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    field.onChange(newType.id);
                    
                    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                    setDebouncedSearch("");
                  } catch (error) { logError(error, "TypeSelectField ItAssets"); }
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