import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsInvoices } from "../hooks/useItAssetsInvoices";
import { sileo } from "sileo";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import type { BackendError } from "@/interfaces/backendError.interfaces";

export const InvoiceSelectField = ({ disabled, initialData }: { disabled?: boolean, initialData?: { id: string, name: string } | null }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
                onSearch={setSearchInput}
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