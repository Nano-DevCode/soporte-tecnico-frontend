import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDepartments } from "../hooks/useDepartment";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const CustomUserFilters = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: departments } = useDepartments();

  const searchTerm = searchParams.get("search") || "";
  const deptFilter = searchParams.get("dept") || "all";
  const statusFilter = searchParams.get("status") || "all";

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
    // Solución: Actualizamos el estado local directamente en el evento,
    // eliminando la necesidad de usar un useEffect para sincronizarlo.
    setLocalSearch(""); 
  };

  // Debounce nativo: Espera 500ms después de que el usuario deja de escribir
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== (searchParams.get("search") || "")) {
        updateFilters("search", localSearch);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]); 

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      {/* Buscador */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          name="searchName"
          placeholder={t("users.components.customUserFilters.placeholderSearch")}
          className="pl-9 h-10 bg-background/60"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Filtro Depto */}
        <Select value={deptFilter} onValueChange={(v) => updateFilters("dept", v)}>
          <SelectTrigger className="w-full sm:w-40 h-10 bg-background/60">
            <SelectValue placeholder={t("users.components.customUserFilters.departmentPlaceholder")} />
          </SelectTrigger>
          
          <SelectContent>
            <SelectItem value="all">{t("users.components.customUserFilters.allDepartments")}</SelectItem>

            {
              departments?.map(department => (
                <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Filtro Estado */}
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-32.5 h-10 bg-background/60">
            <SelectValue placeholder={t("users.components.customUserFilters.placeholderStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("users.components.customUserFilters.allStatus")}</SelectItem>
            <SelectItem value="1">{t("users.components.customUserFilters.activeStatus")}</SelectItem>
            <SelectItem value="0">{t("users.components.customUserFilters.inactiveStatus")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón Limpiar */}
        {(searchTerm || deptFilter !== "all" || statusFilter !== "all") && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span className="sm:hidden lg:inline">{t("users.components.customUserFilters.clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};