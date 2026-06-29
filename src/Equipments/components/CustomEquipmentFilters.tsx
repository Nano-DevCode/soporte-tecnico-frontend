import { memo, useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, FilterX, LayoutGrid, Laptop, Printer, Network, Box, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";
import { useDepartments } from "../hooks/use-equipment-catalog"; // Ajusta la ruta de tus hooks
import { InfiniteScrollSelect } from "../components/infinite-scroll-selectEqip"; // Ajusta la ruta del select infinito
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

  // 1. Inicializamos el hook de departamentos directo de tu factoría
  const {
    options: deptOptions,
    isLoading: isDeptLoading,
    setSearch: setDeptSearch,
    fetchNextPage: fetchNextDeptPage,
    hasNextPage: hasNextDeptPage,
    isFetchingNextPage: isFetchingNextDeptPage,
    setSelectedId: setDeptSelectedId
  } = useDepartments();

  const searchTerm = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const departmentFilter = searchParams.get("id_departament") || "";

  // 2. Sincronizar la hidratación del ID seleccionado con el hook infinito
  useEffect(() => {
    if (departmentFilter) {
      setDeptSelectedId(departmentFilter);
    } else {
      setDeptSelectedId(null);
    }
  }, [departmentFilter, setDeptSelectedId]);

  // Carga inicial de tipos de equipo/categorías
  useEffect(() => {
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

  // Sincroniza el input local si cambia el query string externamente
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const updateFilters = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === "all" || value.trim() === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Debounce para el input de búsqueda general
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue !== searchTerm) {
        updateFilters("search", inputValue);
      }
    }, 800);

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

  // 3. Mapeo y formateo inteligente de los departamentos para el Combobox
  const formattedDepartments = useMemo(() => {
    return deptOptions.map((opt: unknown) => {
      const o = opt as { id: string; name?: string | null };
      return {
        id: String(o.id),
        name: String(o.name ?? "Sin nombre asignado")
      };
    });
  }, [deptOptions]);

  // Reconstrucción del valor del departamento seleccionado actual
  const selectedDept = useMemo(() => {
    if (!departmentFilter) return null;
    const found = formattedDepartments.find(o => String(o.id) === departmentFilter);
    return found ? found : { id: departmentFilter, name: t("eq_select_searching") };
  }, [departmentFilter, formattedDepartments]);

  const hasActiveFilters = 
    currentCategory !== "all" || 
    searchTerm !== "" || 
    statusFilter !== "all" || 
    departmentFilter !== "";

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/50 shadow-sm w-full">
      
      {/* Rejilla de filtros forzada a 2 columnas en pantallas medianas en adelante */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
        
        {/* FILA 1 - COLUMNA 1: BUSCADOR */}
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

        {/* FILA 1 - COLUMNA 2: FILTRO DE ESTADO */}
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

        {/* FILA 2 - COLUMNA 1: SELECTOR DE CATEGORÍAS */}
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

        {/* FILA 2 - COLUMNA 2: SELECT CON SCROLL INFINITO (DEPARTAMENTOS) */}
        <InfiniteScrollSelect
          options={formattedDepartments}
          value={selectedDept}
          onChange={(val) => updateFilters("id_departament", val ? val.id : null)}
          onSearch={setDeptSearch}
          fetchNextPage={fetchNextDeptPage}
          hasNextPage={hasNextDeptPage}
          isFetchingNextPage={isFetchingNextDeptPage}
          isLoading={isDeptLoading}
          placeholder="Departamento"
          allowCreate={false}
        />
      </div>

      {/* BOTÓN LIMPIAR FILTROS */}
      {hasActiveFilters && (
        <div className="flex justify-end w-full pt-1">
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto transition-colors shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" /> {t("ui_filter_btn_clear")}
          </Button>
        </div>
      )}
    </div>
  );
});

CustomEquipmentFilters.displayName = "CustomEquipmentFilters";