import { useSearchParams } from "react-router";

const FILTER_OPTIONS =
    ["search"] as const;

export type FilterKey = typeof FILTER_OPTIONS[number];

export const useTicketFolioFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getFilter = (key: FilterKey, defaultValue: string = "all") =>
        searchParams.get(key) || defaultValue;

    const filters = {
        search: getFilter("search", ""),
    };

    const updateMultipleFilters = (updates: Partial<Record<FilterKey, string | string[] | null>>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            Object.entries(updates).forEach(([key, value]) => {
                let finalValue = value;

                if (Array.isArray(value)) {
                    finalValue = value.join(",");
                }

                if (!finalValue || finalValue === "all") {
                    newParams.delete(key);
                } else {
                    newParams.set(key, finalValue as string);
                }
            });

            newParams.set("page", "1");
            return newParams;
        });
    };

    const updateFilter = (key: FilterKey, value: string | string[]) => {
        updateMultipleFilters({ [key]: value });
    };

    const resetFilters = () => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            FILTER_OPTIONS.forEach(k => newParams.delete(k));
            newParams.set("page", "1");
            return newParams;
        });
    };

    const hasActiveFilters = Object.values(filters).some(val => {
        if (Array.isArray(val)) {
            return val.length > 0;
        }
        return val !== "" && val !== "all";
    });

    return { filters, updateFilter, resetFilters, hasActiveFilters, updateMultipleFilters };
};