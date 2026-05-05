import { memo, useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX } from "lucide-react";
import { useSearchParams } from "react-router";
import { t } from "i18next";
import { InfiniteScrollSelect } from "./infinite-scroll-select";
import { useToolTypes } from "../hooks/useToolTypes";
import { useToolBrands } from "../hooks/useToolBrands";

export const CustomToolFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const statusFilter = searchParams.get("status") || "all";
  const brandFilterId = searchParams.get("brandId");
  const typeFilterId = searchParams.get("typeId");

  // --- Estados EXCLUSIVOS para las barras de búsqueda internas de los Selects ---
  // (Esto no va en la URL para no cambiar la ruta con cada letra que tecleas)
  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");

  const [searchType, setSearchType] = useState("");
  const [debouncedType, setDebouncedType] = useState("");

  // Efectos de Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBrand(searchBrand), 500);
    return () => clearTimeout(timer);
  }, [searchBrand]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedType(searchType), 500);
    return () => clearTimeout(timer);
  }, [searchType]);

  const updateFilters = (key: string, value: string | undefined | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
    setSearchBrand("");
    setSearchType("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const {
    toolBrands,
    fetchNextPage: fetchNextBrandPage,
    hasNextPage: hasNextBrandPage,
    isFetchingNextPage: isFetchingNextBrand,
    isLoading: isLoadingBrands,
  } = useToolBrands(debouncedBrand);

  const {
    toolTypes,
    fetchNextPage: fetchNextTypePage,
    hasNextPage: hasNextTypePage,
    isFetchingNextPage: isFetchingNextType,
    isLoading: isLoadingTypes,
  } = useToolTypes(debouncedType);

  // --- 2. Reconstruir los objetos para el Select basados en el ID de la URL ---
  const selectedTypeObj = useMemo(() => {
    if (!typeFilterId) return null;
    // Busca el nombre real en la lista, si no está (ej: recargó página), muestra un texto genérico
    return toolTypes?.find(t => t.id === typeFilterId) || { id: typeFilterId, name: "Seleccionado..." };
  }, [typeFilterId, toolTypes]);

  const selectedBrandObj = useMemo(() => {
    if (!brandFilterId) return null;
    return toolBrands?.find(b => b.id === brandFilterId) || { id: brandFilterId, name: "Seleccionado..." };
  }, [brandFilterId, toolBrands]);

  const hasActiveFilters = statusFilter !== "all" || brandFilterId || typeFilterId;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center">
        
        {/* Filtro Estado (Status) */}
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-[150px] h-10 bg-background/60">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("custom_department_filters_all_status")}</SelectItem>
            <SelectItem value="true">{t("custom_department_filters_active_status")}</SelectItem>
            <SelectItem value="false">{t("custom_department_filters_inactive_status")}</SelectItem>
          </SelectContent>
        </Select>

        <InfiniteScrollSelect
          options={toolTypes}
          value={selectedTypeObj} // Pasa el objeto calculado de la URL
          onChange={(val) => updateFilters("typeId", val?.id)} // Guarda directo en URL
          onSearch={setSearchType}
          fetchNextPage={fetchNextTypePage}
          hasNextPage={!!hasNextTypePage}
          isFetchingNextPage={isFetchingNextType}
          isLoading={isLoadingTypes}
          placeholder="Buscar tipo de herramienta..."
        />

        <InfiniteScrollSelect
          options={toolBrands}
          value={selectedBrandObj} // Pasa el objeto calculado de la URL
          onChange={(val) => updateFilters("brandId", val?.id)} // Guarda directo en URL
          onSearch={setSearchBrand}
          fetchNextPage={fetchNextBrandPage}
          hasNextPage={!!hasNextBrandPage}
          isFetchingNextPage={isFetchingNextBrand}
          isLoading={isLoadingBrands}
          placeholder="Buscar marca..."
        />

        {/* Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20 shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
});