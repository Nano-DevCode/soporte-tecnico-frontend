import { memo, useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

export const CustomDepartmentFilters = memo(() => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";

  const [inputValue, setInputValue] = useState(searchTerm);

  const updateFilters = useCallback((key: string, value: string) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (!value || value === "all") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      newParams.set("page", "1");
      return newParams;
    });
  }, [setSearchParams]);

  const updateFiltersRef = useRef(updateFilters);
  useEffect(() => {
    updateFiltersRef.current = updateFilters;
  }); 
  useEffect(() => {
    if (inputValue === searchTerm) return;

    const timer = setTimeout(() => {
      updateFiltersRef.current("search", inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchTerm]);

  const resetFilters = () => {
    setInputValue("");
    setSearchParams({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFilters("search", inputValue);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder={t("departments.components.customDepartmentFilters.placeholderSearch")}
          className="pl-9 h-10 bg-background/60 focus-visible:ring-primary"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-37.5 h-10 bg-background/60">
            <SelectValue placeholder={t("departments.components.customDepartmentFilters.placeholderStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("departments.components.customDepartmentFilters.allStatus")}</SelectItem>
            <SelectItem value="true">{t("departments.components.customDepartmentFilters.activeStatus")}</SelectItem>
            <SelectItem value="false">{t("departments.components.customDepartmentFilters.inactiveStatus")}</SelectItem>
          </SelectContent>
        </Select>

        {(searchTerm || statusFilter !== "all") && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("departments.components.customDepartmentFilters.clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
});