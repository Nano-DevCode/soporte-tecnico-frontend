import { memo, useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { InfiniteScrollSelect } from "../../components/custom/InfiniteScrollSelect";

import { useItAssetsTypes } from "../hooks/useItAssetsTypes";
import { useItAssetsBrands } from "../hooks/useItAssetsBrands";
import { useItAssetsModels } from "../hooks/useItAssetsModels";

export const CustomItAssetFilters = memo(() => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const statusFilter = searchParams.get("status") || "all";
  const typeFilterId = searchParams.get("typeId");
  const brandFilterId = searchParams.get("brandId");
  const modelFilterId = searchParams.get("modelId");
  const queryFilter = searchParams.get("query") || "";

  const [searchType, setSearchType] = useState("");
  const [debouncedType, setDebouncedType] = useState("");

  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");

  const [searchModel, setSearchModel] = useState("");
  const [debouncedModel, setDebouncedModel] = useState("");

  const [globalSearch, setGlobalSearch] = useState(queryFilter);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedType(searchType), 500);
    return () => clearTimeout(timer);
  }, [searchType]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBrand(searchBrand), 500);
    return () => clearTimeout(timer);
  }, [searchBrand]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedModel(searchModel), 500);
    return () => clearTimeout(timer);
  }, [searchModel]);

  const updateFilters = useCallback((key: string, value: string | undefined | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const updateFiltersRef = useRef(updateFilters);
  useEffect(() => {
    updateFiltersRef.current = updateFilters;
  }, [updateFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globalSearch !== queryFilter) {
        updateFiltersRef.current("query", globalSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [globalSearch, queryFilter]); 

  const resetFilters = () => {
    setSearchParams({}); 
    setSearchType(""); 
    setSearchBrand(""); 
    setSearchModel("");
    setGlobalSearch(""); 
    if (inputRef.current) inputRef.current.value = "";
  };

  const {
    itAssetsTypes,
    fetchNextPage: fetchNextTypePage,
    hasNextPage: hasNextTypePage,
    isFetchingNextPage: isFetchingNextType,
    isLoading: isLoadingTypes,
  } = useItAssetsTypes(debouncedType);

  const {
    itAssetsBrands,
    fetchNextPage: fetchNextBrandPage,
    hasNextPage: hasNextBrandPage,
    isFetchingNextPage: isFetchingNextBrand,
    isLoading: isLoadingBrands,
  } = useItAssetsBrands(debouncedBrand);

  const {
    itAssetsModels,
    fetchNextPage: fetchNextModelPage,
    hasNextPage: hasNextModelPage,
    isFetchingNextPage: isFetchingNextModel,
    isLoading: isLoadingModels,
  } = useItAssetsModels(debouncedModel);

  const selectedTypeObj = useMemo(() => {
    if (!typeFilterId) return null;
    return itAssetsTypes?.find(tObj => tObj.id === typeFilterId) || { id: typeFilterId, name: t("itAssets.components.filters.selected") };
  }, [typeFilterId, itAssetsTypes, t]);

  const selectedBrandObj = useMemo(() => {
    if (!brandFilterId) return null;
    return itAssetsBrands?.find(b => b.id === brandFilterId) || { id: brandFilterId, name: t("itAssets.components.filters.selected") };
  }, [brandFilterId, itAssetsBrands, t]);

  const selectedModelObj = useMemo(() => {
    if (!modelFilterId) return null;
    return itAssetsModels?.find(m => m.id === modelFilterId) || { id: modelFilterId, name: t("itAssets.components.filters.selected") };
  }, [modelFilterId, itAssetsModels, t]);

  const hasActiveFilters = 
    statusFilter !== "all" || 
    typeFilterId || 
    brandFilterId || 
    modelFilterId || 
    queryFilter.length > 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t("itAssets.components.filters.searchPlaceholder")}
            className="w-full pl-9 bg-background/60 h-10"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-50 h-10 bg-background/60">
            <SelectValue placeholder={t("itAssets.components.filters.statusPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("itAssets.components.filters.status.all")}</SelectItem>
            <SelectItem value="true">{t("itAssets.components.filters.status.active")}</SelectItem>
            <SelectItem value="false">{t("itAssets.components.filters.status.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:flex-1">
          <InfiniteScrollSelect
            options={itAssetsTypes}
            value={selectedTypeObj} 
            onChange={(val) => updateFilters("typeId", val?.id)} 
            onSearch={setSearchType}
            fetchNextPage={fetchNextTypePage}
            hasNextPage={!!hasNextTypePage}
            isFetchingNextPage={isFetchingNextType}
            isLoading={isLoadingTypes}
            placeholder={t("itAssets.components.filters.typePlaceholder")}
          />
        </div>

        <div className="w-full sm:flex-1">
          <InfiniteScrollSelect
            options={itAssetsBrands}
            value={selectedBrandObj} 
            onChange={(val) => updateFilters("brandId", val?.id)} 
            onSearch={setSearchBrand}
            fetchNextPage={fetchNextBrandPage}
            hasNextPage={!!hasNextBrandPage}
            isFetchingNextPage={isFetchingNextBrand}
            isLoading={isLoadingBrands}
            placeholder={t("itAssets.components.filters.brandPlaceholder")}
          />
        </div>

        <div className="w-full sm:flex-1">
          <InfiniteScrollSelect
            options={itAssetsModels}
            value={selectedModelObj} 
            onChange={(val) => updateFilters("modelId", val?.id)} 
            onSearch={setSearchModel}
            fetchNextPage={fetchNextModelPage}
            hasNextPage={!!hasNextModelPage}
            isFetchingNextPage={isFetchingNextModel}
            isLoading={isLoadingModels}
            placeholder={t("itAssets.components.filters.modelPlaceholder")}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="w-full sm:w-auto h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20 shrink-0"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span>{t("itAssets.components.filters.clear")}</span>
          </Button>
        )}
      </div>
    </div>
  );
});