import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export const CustomFilterCenterManagers = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== searchTerm) {
      inputRef.current.value = searchTerm;
    }
  }, [searchTerm]);

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
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.delete("status");
    newParams.set("page", "1");
    setSearchParams(newParams);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFilters("search", inputRef.current?.value || "");
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">

      {/* Buscador */}
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>

          <InputGroupInput
            name="searchBar"
            placeholder={t('center_managers.list_page.filters.searchBar_placeholder')}
            defaultValue={searchTerm}
            ref={inputRef}
          />
        </InputGroup>
        <button type="submit" className="sr-only">Buscar</button>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

        {/* Filtro Estado */}
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full md:w-40">
            <div className="flex gap-4">
              <span className="text-muted-foreground ">{t("common.filters.status.name")}:</span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.filters.status.options.all")}</SelectItem>
            <SelectItem value="1">{t("common.filters.status.options.active")}</SelectItem>
            <SelectItem value="0">{t("common.filters.status.options.inactive")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón Limpiar */}
        {(searchTerm || statusFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <FilterX className="h-4 w-4 " />
            <span className="sm:hidden lg:inline">{t("common.filters.clean")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};