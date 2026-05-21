import { memo, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, FilterX, LayoutGrid, Laptop, Printer, Network, Box, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";

const ICON_MAP: Record<string, LucideIcon> = {
  computadora: Laptop,
  impresora: Printer,
  red: Network,
  default: Box
};

export const CustomEquipmentFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";

  // --- CARGA AUTÓNOMA ---
  useEffect(() => {
    getEquipmentTypesAction().then(setCategories);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchTerm;
    }
  }, [searchTerm]);


  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    // Si el valor es vacío o es "all", limpiamos la URL para mantenerla estética
    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1"); // Resetea siempre a la primera página
    setSearchParams(newParams);
  };

  // Ajuste en la limpieza: Vaciamos por completo el objeto URLSearchParams 
  // para remover "search", "status" y "category" de golpe de la barra de direcciones.
  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    setSearchParams(newParams);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Evaluamos si hay algún filtro activo para mostrar el botón de limpiar
  const hasActiveFilters = currentCategory !== "all" || searchTerm !== "" || statusFilter !== "all";

  return (
    <div className="grid grid-cols-1 gap-3 p-4 rounded-xl border bg-card/50 shadow-sm md:grid-cols-3 md:items-center">

      {/* BUSCADOR POR INVENTARIO */}
      <div className="relative w-full h-10">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          id="search"
          placeholder="Buscar por número de inventario"
          className="pl-9 h-10 w-full"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && updateFilters("search", inputRef.current?.value || "")}
        />
      </div>

      {/*  FILTRO DE ESTADO (Activo / Inactivo) */}
      <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
        <SelectTrigger className="w-full h-10 bg-background/60">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Estados</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      {/* CATEGORÍAS Y BOTÓN LIMPIAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full">
        <Select value={currentCategory} onValueChange={(v) => updateFilters("category", v)}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-slate-500" />
                <span>Todos los Equipos</span>
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

        {/* Muestra el botón dinámicamente si hay filtros activos */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto transition-colors"
          >
            <FilterX className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>
    </div>
  );
});
