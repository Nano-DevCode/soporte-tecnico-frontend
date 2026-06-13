import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { t } from "i18next";

export const CustomConsumableFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Obtenemos el término de búsqueda actual de la URL
  const searchTerm = searchParams.get("search") || "";

  // Actualiza los parámetros de la URL de forma reactiva
  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value.trim() === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    // Siempre reiniciamos a la página 1 al filtrar para evitar desfases en la paginación
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Limpia por completo la barra de búsqueda y remueve los parámetros de la URL
  const resetFilters = () => {
    setSearchParams({});
    if (inputRef.current) inputRef.current.value = "";
  };

  // Dispara el filtrado únicamente cuando el usuario presiona "Enter"
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    updateFilters("search", inputRef.current?.value || "");
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      {/* Buscador de Consumibles Inteligente (QueryBuilder Backend) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder={t("custom_consumable_filters_placeholder_search")}
          className="pl-9 h-10 bg-background/60 focus-visible:ring-primary"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Sección de acciones de filtrado */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        
        {/* El botón de limpiar filtros solo aparece si hay texto escrito en la URL */}
        {searchTerm && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="w-full sm:w-auto h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
});

CustomConsumableFilters.displayName = "CustomConsumableFilters";