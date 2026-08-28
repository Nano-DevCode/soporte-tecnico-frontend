import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useSearchParams } from "react-router";
import { useState, useEffect } from "react";

export const CustomKpiFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const performanceFilter = searchParams.get("performanceStatus") || "all";
  const sortByFilter = searchParams.get("sortBy") || "all";
  const orderFilter = searchParams.get("order") || "DESC";

  const [localSearch, setLocalSearch] = useState(searchTerm);

  const updateFilters = (key: string, value: string) => {
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
    setLocalSearch(""); 
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== (searchParams.get("search") || "")) {
        updateFilters("search", localSearch);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]); 

  const hasActiveFilters = searchTerm || performanceFilter !== "all" || sortByFilter !== "all" || orderFilter !== "DESC";

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm xl:flex-row xl:items-center">
      
      {/* Buscador libre (Nombre, Correo, No. Control) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          name="searchKpi"
          placeholder="Buscar por nombre, correo o matrícula..."
          className="pl-9 h-10 bg-background/60 transition-all focus:bg-background"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:items-center">
        {/* Filtro por Semáforo de Rendimiento */}
        <Select value={performanceFilter} onValueChange={(v) => updateFilters("performanceStatus", v)}>
          <SelectTrigger className="w-full sm:w-40 h-10 bg-background/60">
            <SelectValue placeholder="Rendimiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="excellent">🟢 Excelente (≥ 80%)</SelectItem>
            <SelectItem value="regular">🟡 Regular (60% - 79%)</SelectItem>
            <SelectItem value="attention">🔴 Atención (&lt; 60%)</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Criterio de Ordenamiento */}
        <Select value={sortByFilter} onValueChange={(v) => updateFilters("sortBy", v)}>
          <SelectTrigger className="w-full sm:w-37.5 h-10 bg-background/60">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Efectividad Global</SelectItem>
            <SelectItem value="pending">Tickets Pendientes</SelectItem>
            <SelectItem value="speed">Tiempo de Resolución</SelectItem>
            <SelectItem value="assigned">Volumen Asignado</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 shrink-0 bg-background/60 text-muted-foreground hover:text-foreground"
          onClick={() => updateFilters("order", orderFilter === "DESC" ? "ASC" : "DESC")}
          title={orderFilter === "DESC" ? "Orden Descendente" : "Orden Ascendente"}
        >
          {orderFilter === "DESC" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
        </Button>

        {/* Botón Limpiar */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <FilterX className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Limpiar</span>
          </Button>
        )}
      </div>
    </div>
  );
};