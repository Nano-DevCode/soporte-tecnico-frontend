import React, { useState, useMemo, useCallback } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { t } from "i18next";

interface Option {
  id: string;
  name: string;
}

interface InfiniteScrollSelectProps {
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  onSearch: (term: string) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  placeholder?: string;
  allowCreate?: boolean;
  onCreate?: (newItemName: string) => void;
  disabled?: boolean;
}

export const InfiniteScrollSelect = React.memo(function InfiniteScrollSelect({
  options,
  value,
  onChange,
  onSearch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  placeholder = t("eq_select_default_placeholder"),
  allowCreate = false,
  onCreate,
  disabled = false,
}: InfiniteScrollSelectProps) {
  const [inputValue, setInputValue] = useState(value?.name ?? "");
  const [prevValueId, setPrevValueId] = useState(value?.id);

  if (value?.id !== prevValueId) {
    setPrevValueId(value?.id);
    setInputValue(value?.name ?? "");
  }

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isExactMatch = useMemo(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput) return false;
    return options.some((opt) => opt.name.toLowerCase() === trimmedInput);
  }, [options, inputValue]);

  const showCreateOption = allowCreate && inputValue.trim().length > 0 && !isExactMatch;

  const renderedOptions = useMemo(() => {
    return options.map((option) => (
      <ComboboxItem
        key={option.id}
        value={option}
        className="flex items-center justify-between py-2 cursor-pointer"
      >
        <span className="truncate">{option.name}</span>
        {value?.id === option.id && <Check className="h-4 w-4 text-primary" />}
      </ComboboxItem>
    ));
  }, [options, value?.id]);

  return (
    <Combobox
      items={options}
      itemToStringValue={(option) => option?.name ?? ""}
      value={value}
      onValueChange={(val) => {
        if (val?.id === "CREATE_NEW_ITEM") {
          onCreate?.(val.name);
        } else {
          onChange(val);
          setInputValue(val?.name ?? "");
        }
      }}
    >
      <div className="w-full">
        <ComboboxInput
          disabled={isLoading || disabled}
          placeholder={placeholder}
          showClear
          value={inputValue}
          className="w-full"
          onChange={(e) => {
            setInputValue(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>

      <ComboboxContent className="shadow-xl border-zinc-800">
        <ComboboxEmpty className="py-6 text-center text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground">{t("eq_select_searching")}</span>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              {showCreateOption ? t("eq_select_press_to_create") : t("eq_select_no_results")}
            </p>
          )}
        </ComboboxEmpty>

        <ComboboxList
          onScroll={handleScroll}
          className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {renderedOptions}

          {showCreateOption && (
            <ComboboxItem
              value={{ id: "CREATE_NEW_ITEM", name: inputValue.trim() }}
              className="mt-1 border-t border-zinc-800 pt-2 text-primary font-semibold hover:bg-primary/5 flex items-center gap-2 group/create transition-colors"
            >
              <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 group-hover/create:bg-primary/20 transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              <span className="truncate text-sm">{t("eq_select_create_prefix")} "{inputValue.trim()}"</span>
            </ComboboxItem>
          )}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-zinc-900 bg-zinc-950/50">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                {t("eq_select_loading_more")}
              </span>
            </div>
          )}
        </ComboboxList>

        {!hasNextPage && options.length > 0 && !showCreateOption && (
          <div className="py-2 border-t border-zinc-900 bg-zinc-900/20 text-center">
            <span className="text-[10px] text-zinc-500 font-medium">
              {t("eq_select_end_of_catalog")}
            </span>
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  );
});