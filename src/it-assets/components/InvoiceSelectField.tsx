import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useItAssetsInvoices } from "../hooks/useItAssetsInvoices";
import { InfiniteScrollSelect } from "@/Equipments/components/infinite-scroll-select";
import { sileo } from "sileo";

export const InvoiceSelectField = ({ disabled }: { disabled?: boolean }) => {
  const { control } = useFormContext();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { 
    itAssetsInvoices, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    createInvoice,
    isCreating
  } = useItAssetsInvoices(debouncedSearch);

  const options = useMemo(() => {
    return itAssetsInvoices.map(invoice => ({ 
      id: invoice.id,
      name: invoice.idInternal || "Sin nombre"
    }));
  }, [itAssetsInvoices]);

  return (
    <FormField
      control={control}
      name="invoiceId"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Factura (Opcional)</FormLabel>
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
              placeholder="Buscar o crear factura..."
              disabled={disabled || isCreating}
              allowCreate={true} // <-- Habilitamos la creación
              onCreate={async (newItemName) => {
                try {
                  const newInvoice = await sileo.promise(
                    createInvoice({ name: newItemName }),
                    {
                      loading: { title: `Creando factura "${newItemName}"...` },
                      success: { title: "Factura creada exitosamente" },
                      error: { title: "Error al crear la factura" }
                    }
                  );
                  field.onChange(newInvoice.id);
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