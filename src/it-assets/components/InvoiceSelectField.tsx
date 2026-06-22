import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsInvoices } from "../hooks/useItAssetsInvoices";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { logError } from "@/utils/logger";

export const InvoiceSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
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
    const timer = searchTimerRef;
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const { itAssetsInvoices, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createInvoice, isCreating } = useItAssetsInvoices(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsInvoices.map(invoice => ({ 
      id: invoice.id,
      name: invoice.idInternal || t("itAssets.components.invoiceSelectField.unnamed")
    }));
  }, [itAssetsInvoices, t]);

  return (
    <FormField
      control={control}
      name="invoiceId"
      render={({ field }) => {
        const selectedOption = options.find(opt => opt.id === field.value) || (field.value === initialData?.id ? initialData : null);

        return (
          <FormItem className="w-full">
            <FormLabel>{t("itAssets.components.invoiceSelectField.label")}</FormLabel>
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
                placeholder={t("itAssets.components.invoiceSelectField.placeholder")}
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newInvoice = await sileo.promise(createInvoice({ idInternal: newItemName }), {
                      loading: { title: t("itAssets.components.invoiceSelectField.sileo.loading.title") },
                      success: { title: t("itAssets.components.invoiceSelectField.sileo.success.title") },
                      error: (err) => {
                        let backendMessage = t("itAssets.components.invoiceSelectField.sileo.error.defaultMessage");
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: t("itAssets.components.invoiceSelectField.sileo.error.title"),
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    field.onChange(newInvoice.id);
                    
                    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                    setDebouncedSearch("");
                  } catch (error) { logError(error, "InvoiceSelectField ItAssets" ); }
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