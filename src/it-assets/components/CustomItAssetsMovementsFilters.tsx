import { memo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el español para las fechas
import { useTranslation } from "react-i18next";
import { FilterX, Search, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const CustomItAssetsMovementsFilters = memo(() => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Lectura de parámetros de la URL
  const queryFilter = searchParams.get("query") || "";
  const typeFilter = searchParams.get("type") || "all";
  const startDateFilter = searchParams.get("startDate") || "";
  const endDateFilter = searchParams.get("endDate") || "";

  // Estado local para la búsqueda global (con debounce)
  const [globalSearch, setGlobalSearch] = useState(queryFilter);

  // Efecto de Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (globalSearch !== queryFilter) {
        updateFilters("query", globalSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [globalSearch, queryFilter]);

  // Función genérica para actualizar la URL
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

  // Limpieza total
  const resetFilters = () => {
    setSearchParams({});
    setGlobalSearch("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasActiveFilters =
    queryFilter.length > 0 ||
    typeFilter !== "all" ||
    startDateFilter !== "" ||
    endDateFilter !== "";

  // Convertimos los strings de la URL a objetos Date para el calendario
  const startDateObj = startDateFilter ? parseISO(startDateFilter) : undefined;
  const endDateObj = endDateFilter ? parseISO(endDateFilter) : undefined;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border/60 bg-card shadow-sm animate-in fade-in duration-300">
      
      {/* --- FILA 1: Búsqueda Global y Tipo de Movimiento --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t("itAssets.components.movementFilters.searchPlaceholder")}
            className="w-full pl-9 bg-background h-10 transition-colors focus-visible:ring-1"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => updateFilters("type", v)}>
          <SelectTrigger className="w-full sm:w-[260px] h-10 bg-background transition-colors focus:ring-1">
            <SelectValue placeholder={t("itAssets.components.movementFilters.typePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("itAssets.components.movementFilters.types.all")}</SelectItem>
            <SelectItem value="IN">{t("itAssets.components.movementFilters.types.in")}</SelectItem>
            <SelectItem value="OUT">{t("itAssets.components.movementFilters.types.out")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- FILA 2: Fechas con Popover y Calendar de shadcn --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        
        {/* Fecha Inicio */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:flex-1 h-10 justify-start text-left font-normal bg-background hover:bg-background/80 transition-colors",
                !startDateObj && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {startDateObj ? (
                format(startDateObj, "PPP", { locale: es })
              ) : (
                <span>{t("itAssets.components.movementFilters.dateStartPlaceholder")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDateObj}
              onSelect={(date) => updateFilters("startDate", date ? format(date, "yyyy-MM-dd") : "")}
              // 👇 Nueva validación: Bloquea las fechas posteriores a endDateObj
              disabled={endDateObj ? { after: endDateObj } : undefined}
            />
          </PopoverContent>
        </Popover>

        {/* Fecha Fin */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:flex-1 h-10 justify-start text-left font-normal bg-background hover:bg-background/80 transition-colors",
                !endDateObj && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {endDateObj ? (
                format(endDateObj, "PPP", { locale: es })
              ) : (
                <span>{t("itAssets.components.movementFilters.dateEndPlaceholder")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDateObj}
              onSelect={(date) => updateFilters("endDate", date ? format(date, "yyyy-MM-dd") : "")}
              // 👇 Nueva validación: Bloquea las fechas anteriores a startDateObj
              disabled={startDateObj ? { before: startDateObj } : undefined}
            />
          </PopoverContent>
        </Popover>

        {/* Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="w-full sm:w-auto h-10 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("itAssets.components.movementFilters.clear")}</span>
          </Button>
        )}
      </div>
      
    </div>
  );
});