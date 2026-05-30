import { useSearchParams } from "react-router";

const FILTER_OPTIONS = ["search", "status", "priority", "school_period", "department", "issue_type"] as const;

export type FilterKey = typeof FILTER_OPTIONS[number];

export const useTicketFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilter = (key: FilterKey, defaultValue: string = "all") =>
    searchParams.get(key) || defaultValue;

  const filters: Record<FilterKey, string> = {
    search: getFilter("search", ""),
    status: getFilter("status"),
    priority: getFilter("priority"),
    school_period: getFilter("school_period"),
    department: getFilter("department"),
    issue_type: getFilter("issue_type"),
  };

  const updateFilter = (key: FilterKey, value: string) => {
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
      FILTER_OPTIONS.forEach(k => newParams.delete(k));
      newParams.set("page", "1");
      return newParams;
    });
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== "all");

  return { filters, updateFilter, resetFilters, hasActiveFilters };
};