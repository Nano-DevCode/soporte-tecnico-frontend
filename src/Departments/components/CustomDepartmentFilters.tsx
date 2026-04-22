import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { t } from "i18next";

export const CustomDepartmentFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";

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
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    updateFilters("search", inputRef.current?.value || "");
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      {/* Buscador de Departamentos (Query) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder={t("custom_department_filters_placeholder_searchs")}
          className="pl-9 h-10 bg-background/60 focus-visible:ring-primary"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        
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

        {/* Botón Limpiar Filtros */}
        {(searchTerm || statusFilter !== "all") && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
});