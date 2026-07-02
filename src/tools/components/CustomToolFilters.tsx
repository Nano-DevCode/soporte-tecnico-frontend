import { memo, useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { t } from "i18next";
import { InfiniteScrollSelect } from "../../components/custom/InfiniteScrollSelect";
import { useToolTypes } from "../hooks/useToolTypes";
import { useToolBrands } from "../hooks/useToolBrands";

export const CustomToolFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Lectura de parámetros de la URL
  const statusFilter = searchParams.get("status") || "all";
  const haveInternalIdFilter = searchParams.get("haveInternalId") || "all";
  const brandFilterId = searchParams.get("brandId");
  const typeFilterId = searchParams.get("typeId");
  const queryFilter = searchParams.get("query") || "";

  // Estados locales para las búsquedas
  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");

  const [searchType, setSearchType] = useState("");
  const [debouncedType, setDebouncedType] = useState("");

  const [globalSearch, setGlobalSearch] = useState(queryFilter);

  // Efectos de Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBrand(searchBrand), 500);
    return () => clearTimeout(timer);
  }, [searchBrand]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedType(searchType), 500);
    return () => clearTimeout(timer);
  }, [searchType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globalSearch !== queryFilter) {
        updateFilters("query", globalSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [globalSearch, queryFilter]);

  // Actualizar la URL
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

  // Lógica completa de Limpiar Filtros
  const resetFilters = () => {
    setSearchParams({}); // Limpia la URL
    setSearchBrand(""); // Limpia el buscador interno de marcas
    setSearchType(""); // Limpia el buscador interno de tipos
    setGlobalSearch(""); // Limpia el input text global
    if (inputRef.current) inputRef.current.value = "";
  };

  // Fetch de data
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

  // Reconstrucción de objetos para el Select
  const selectedTypeObj = useMemo(() => {
    if (!typeFilterId) return null;
    return toolTypes?.find(t => t.id === typeFilterId) || { id: typeFilterId, name: "Seleccionado..." };
  }, [typeFilterId, toolTypes]);

  const selectedBrandObj = useMemo(() => {
    if (!brandFilterId) return null;
    return toolBrands?.find(b => b.id === brandFilterId) || { id: brandFilterId, name: "Seleccionado..." };
  }, [brandFilterId, toolBrands]);

  // Mostrar el botón "Limpiar" solo si hay CUALQUIER filtro activo
  const hasActiveFilters = 
    statusFilter !== "all" || 
    haveInternalIdFilter !== "all" || 
    brandFilterId || 
    typeFilterId || 
    queryFilter.length > 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm">
      
      {/* --- FILA 1: Búsqueda y Estado --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Barra de Búsqueda Global */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar herramienta..."
            className="w-full pl-9 bg-background/60 h-10"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        {/* Filtro Estado (Status) */}
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-50 h-10 bg-background/60">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("tools.components.filters.status.all")}</SelectItem>
            <SelectItem value="true">{t("tools.components.filters.status.active") }</SelectItem>
            <SelectItem value="false">{t("tools.components.filters.status.inactive") }</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- FILA 2: ID Interno, Tipo, Marca y Limpiar --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Filtro ID Interno */}
        <div className="w-full sm:flex-1">
          <Select value={haveInternalIdFilter} onValueChange={(v) => updateFilters("haveInternalId", v)}>
            <SelectTrigger className="w-full h-10 bg-background/60">
              <SelectValue placeholder="ID Interno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Con ID Interno</SelectItem>
              <SelectItem value="false">Sin ID Interno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Select de Tipos */}
        <div className="w-full sm:flex-1">
          <InfiniteScrollSelect
            options={toolTypes}
            value={selectedTypeObj} 
            onChange={(val) => updateFilters("typeId", val?.id)} 
            onSearch={setSearchType}
            fetchNextPage={fetchNextTypePage}
            hasNextPage={!!hasNextTypePage}
            isFetchingNextPage={isFetchingNextType}
            isLoading={isLoadingTypes}
            placeholder="Buscar tipo..."
          />
        </div>

        {/* Select de Marcas */}
        <div className="w-full sm:flex-1">
          <InfiniteScrollSelect
            options={toolBrands}
            value={selectedBrandObj} 
            onChange={(val) => updateFilters("brandId", val?.id)} 
            onSearch={setSearchBrand}
            fetchNextPage={fetchNextBrandPage}
            hasNextPage={!!hasNextBrandPage}
            isFetchingNextPage={isFetchingNextBrand}
            isLoading={isLoadingBrands}
            placeholder="Buscar marca..."
          />
        </div>

        {/* Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="w-full sm:w-auto h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20 shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("clear") || "Limpiar"}</span>
          </Button>
        )}
      </div>
      
    </div>
  );
});