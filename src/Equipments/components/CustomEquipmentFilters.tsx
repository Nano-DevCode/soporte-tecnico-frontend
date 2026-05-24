import { memo, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, FilterX, LayoutGrid, Laptop, Printer, Network, Box, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";
import { t } from "i18next";

const ICON_MAP: Record<string, LucideIcon> = {
  computadora: Laptop,
  impresora: Printer,
  red: Network,
  default: Box
};

export const CustomEquipmentFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";

  // 1. CARGA DE CATEGORÍAS ADAPTADA AL RETORNO PAGINADO
  useEffect(() => {
    // Solicitamos un límite alto (ej. 100) para traer todas las categorías necesarias para el selector
    getEquipmentTypesAction({ limit: 100, offset: 0 })
      .then((response) => {
        if (response && Array.isArray(response.equipmentTypes)) {
          setCategories(response.equipmentTypes);
        }
      })
      .catch((error) => {
        console.error("Error cargando categorías en los filtros:", error);
      });
  }, []);

  // Sincroniza el estado del input local si el query param cambia externamente (ej. al limpiar filtros)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1"); // Resetea a la primera página al cambiar criterios
    setSearchParams(newParams);
  };

  // 2. DEBOUNCE EFECTIVO PARA LA BÚSQUEDA FLUIDA
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Evitamos actualizar la URL si el valor sigue siendo el mismo
      if (inputValue !== searchTerm) {
        updateFilters("search", inputValue);
      }
    }, 400); // Espera 400ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, searchTerm]);

  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    
    const currentLimit = searchParams.get("limit");
    if (currentLimit) newParams.set("limit", currentLimit);
    
    newParams.set("page", "1");
    setSearchParams(newParams);
    setInputValue("");
  };

  const hasActiveFilters = currentCategory !== "all" || searchTerm !== "" || statusFilter !== "all";

  return (
    <div className="grid grid-cols-1 gap-3 p-4 rounded-xl border bg-card/50 shadow-sm md:grid-cols-3 md:items-center">
      
      {/* BUSCADOR CON CONTROL DE ESTADO CONTROLADO (DEBOUNCED) */}
      <div className="relative w-full h-10">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          id="search"
          placeholder={t("ui_filter_search_placeholder")}
          className="pl-9 h-10 w-full"
          value={inputValue}
          ref={inputRef}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {/* FILTRO DE ESTADO */}
      <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
        <SelectTrigger className="w-full h-10 bg-background/60">
          <SelectValue placeholder={t("ui_filter_status_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("ui_filter_status_all")}</SelectItem>
          <SelectItem value="true">{t("ui_filter_status_active")}</SelectItem>
          <SelectItem value="false">{t("ui_filter_status_inactive")}</SelectItem>
        </SelectContent>
      </Select>

      {/* CATEGORÍAS Y BOTÓN LIMPIAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full">
        <Select value={currentCategory} onValueChange={(v) => updateFilters("category", v)}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={t("ui_filter_category_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-slate-500" />
                <span>{t("ui_filter_category_all")}</span>
              </div>
            </SelectItem>

            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.name.toLowerCase()] || ICON_MAP.default;
              return (
                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="capitalize">{cat.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto transition-colors shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" /> {t("ui_filter_btn_clear")}
          </Button>
        )}
      </div>
    </div>
  );
});

CustomEquipmentFilters.displayName = "CustomEquipmentFilters";