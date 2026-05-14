import { memo, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, FilterX, LayoutGrid, Laptop, Printer, Network, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";


const ICON_MAP: Record<string, any> = {
  computadora: Laptop,
  impresora: Printer,
  red: Network,
  default: Box
};

export const CustomEquipmentFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";

  // --- CARGA AUTÓNOMA ---
  useEffect(() => {
    getEquipmentTypesAction().then(setCategories);
  }, []);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "all") newParams.delete(key);
    else newParams.set(key, value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/50 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder="Buscar equipo..."
          className="pl-9 h-10"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && updateFilters("search", inputRef.current?.value || "")}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={currentCategory} onValueChange={(v) => updateFilters("category", v)}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {/* Opción General fija */}
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-slate-500" />
                <span>Todos los Equipos</span>
              </div>
            </SelectItem>

            {/* OPCIONES DINÁMICAS: Se rellenan solas con lo que mande el Back */}
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

        {(searchTerm || currentCategory !== "all") && (
          <Button variant="ghost" onClick={() => setSearchParams({category: "all"})} className="h-10">
            <FilterX className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>
    </div>
  );
});