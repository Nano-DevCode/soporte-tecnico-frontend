import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { CustomDebouncedSearch } from "@/components/custom/CustomDebounceSearch";

export const CustomFilterTickets = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";

  const updateFilters = (key: string, value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (!value || value === "all") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const resetFilters = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">

      <CustomDebouncedSearch
        defaultValue={searchTerm}
        placeholder={t('common.filters.search')}
        onSearch={(value) => updateFilters("search", value)}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <FilterX className="h-4 w-4" />
            <span className="sm:hidden lg:inline">{t("common.filters.clean")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};