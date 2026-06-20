import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsBrands } from "../hooks/useItAssetsBrands";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const BrandSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
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
            <FormLabel>{t("itAssets.components.brandSelectField.label")} <span className="text-red-500">*</span></FormLabel>
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
                placeholder={t("itAssets.components.brandSelectField.placeholder")}
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newBrand = await sileo.promise(createBrand({ name: newItemName }), {
                      loading: { title: t("itAssets.components.brandSelectField.sileo.loading.title", { name: newItemName }) },
                      success: { title: t("itAssets.components.brandSelectField.sileo.success.title") },
                      error: (err) => {
                        let backendMessage = t("itAssets.components.brandSelectField.sileo.error.defaultMessage");
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: t("itAssets.components.brandSelectField.sileo.error.title"),
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    field.onChange(newBrand.id);
                    
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