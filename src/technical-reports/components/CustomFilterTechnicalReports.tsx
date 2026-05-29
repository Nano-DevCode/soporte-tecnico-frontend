import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { CustomDebouncedSearch } from "@/components/custom/CustomDebounceSearch";


export const CustomFilterTechnicalReports = () => {
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

    const hasActiveFilters = searchTerm


    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/50 shadow-sm">

            <CustomDebouncedSearch
                defaultValue={searchTerm}
                placeholder={t('common.filters.search')}
                onSearch={(value) => updateFilters("search", value)}
                className="min-w-1/1 lg:min-w-3/5"
            />



            {hasActiveFilters && (
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="md:self-end text-muted-foreground border hover:text-destructive hover:bg-destructive/10"
                >
                    <FilterX className="h-4 w-4" />
                    <span>{t("common.filters.clean")}</span>
                </Button>
            )}

        </div>

    );
};