import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToolsTypes } from "../hooks/useToolsTypes";
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

  const { toolsTypes, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, createType, isCreating } = useToolsTypes(debouncedSearch);

  const options = useMemo(() => {
    return toolsTypes.map(type => ({ id: type.id, name: type.name }));
  }, [toolsTypes]);

  return (
    <FormField
      control={control}
      name="typeId"
      render={({ field }) => {
        // 1. Aseguramos que el valor de react-hook-form sea siempre un string
        const currentValue = field.value ? String(field.value) : "";

        // 2. Buscamos la opción comparando estrictamente strings (UUIDs)
        let selectedOption = options.find(opt => String(opt.id) === currentValue);

        // 3. Fallback seguro si la opción aún no está en la lista cargada
        if (!selectedOption && initialData && String(initialData.id) === currentValue) {
          selectedOption = initialData;
        }

        return (
          <FormItem className="w-full">
            <FormLabel>{t("tools.components.typeSelectField.label")} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <InfiniteScrollSelect
                options={options}
                value={selectedOption || null}
                
                // 4. onChange blindado: maneja tanto si llega el ID suelto como el objeto entero
                onChange={(val) => {
                  if (!val) {
                    field.onChange("");
                    return;
                  }
                  const newId = typeof val === "object" && "id" in val ? val.id : val;
                  field.onChange(String(newId));
                }}
                
                onSearch={handleSearch}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                placeholder={t("tools.components.typeSelectField.placeholder")}
                disabled={disabled || isCreating}
                allowCreate={true}
                onCreate={async (newItemName) => {
                  try {
                    const newType = await sileo.promise(createType({ name: newItemName }), {
                      loading: { title: t("tools.components.typeSelectField.sileo.loading.title", { name: newItemName }) },
                      success: { title: t("tools.components.typeSelectField.sileo.success.title") },
                      error: (err) => {
                        let backendMessage = t("tools.components.typeSelectField.sileo.error.defaultMessage");
                        if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
                          const rawMessage = err.response.data.message;
                          backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
                        }
                        return {
                          title: t("tools.components.typeSelectField.sileo.error.title"),
                          description: backendMessage,
                          duration: 5000,
                        };
                      }
                    });
                    
                    // Aseguramos que el nuevo ID también se guarde como string
                    field.onChange(String(newType.id));
                    
                    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                    setDebouncedSearch("");
                  } catch (error) { logError(error, "TypeSelectField Tools"); }
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