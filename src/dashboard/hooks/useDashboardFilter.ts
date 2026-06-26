import { useSearchParams } from "react-router";

const FILTER_OPTIONS =
    ["status", "priority", "school_period", "department", "issue_type", "tags", "start_date", "end_date"] as const;

export type FilterKey = typeof FILTER_OPTIONS[number];

export const useDashboardFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getFilter = (key: FilterKey, defaultValue: string = "all") =>
        searchParams.get(key) || defaultValue;

    const getArrayFilter = (key: FilterKey): string[] => {
        const value = searchParams.get(key);
        if (!value) return [];
        return value.split(",").filter(Boolean);
    };

    const filters = {
        status: getFilter("status"),
        priority: getFilter("priority"),
        school_period: getFilter("school_period"),
        department: getFilter("department"),
        issue_type: getFilter("issue_type"),
        tags: getArrayFilter("tags"),
        start_date: getFilter("start_date", ""),
        end_date: getFilter("end_date", ""),
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