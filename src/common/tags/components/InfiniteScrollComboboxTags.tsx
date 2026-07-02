import { useInfiniteGetTags } from "@/common/tags/hooks/useGetTags";
import { useDebounce } from "@/components/hooks/useDebounce";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { normalizeForComparison } from "@/lib/helpers/normalizeForComparison";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    value: string[] | undefined;
    onChange: (value: string[]) => void;
    disabled?: boolean;
    id?: string;
    creatable?: boolean;
}

const EMPTY_ARRAY: string[] = [];

export const InfiniteScrollComboboxTags = ({ value = EMPTY_ARRAY, onChange, disabled, id, creatable = true }: Props) => {

    const { t } = useTranslation();
    const anchor = useComboboxAnchor();
    const [inputValue, setInputValue] = useState("");

    const debouncedSearch = useDebounce(inputValue, 300);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteGetTags({
        search: debouncedSearch
    });

    const isTyping = inputValue !== debouncedSearch && inputValue.trim().length > 0;
    const isSearchFetching = isFetching && !isFetchingNextPage;
    const isSyncing = isTyping || isSearchFetching;

    const tagNames = useMemo(() => {
        return data?.pages.flatMap((page) => page.data.map((tag) => tag.name)) || [];
    }, [data]);


    const dynamicItems = useMemo(() => {
        const items = [...tagNames];
        const cleanInput = inputValue.trim().toUpperCase();

        value.forEach((val) => {
            if (!items.includes(val)) {
                if (cleanInput) {
                    if (normalizeForComparison(val).includes(normalizeForComparison(cleanInput))) {
                        items.unshift(val);
                    }
                } else {
                    items.unshift(val);
                }
            }
        });

        if (cleanInput && cleanInput !== '__LOAD_MORE__') {
            const normalizedInput = normalizeForComparison(cleanInput);

            const exactMatchExists = items.some(t => normalizeForComparison(t) === normalizedInput);
            const isAlreadySelected = value.some(v => normalizeForComparison(v) === normalizedInput);

            if (creatable && !exactMatchExists && !isAlreadySelected && !isSyncing) {
                items.unshift(cleanInput);
            }
        }

        if (hasNextPage) { items.push('__LOAD_MORE__') }

        return items;
    }, [tagNames, inputValue, value, hasNextPage, creatable, isSyncing]);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isFetchingNextPage) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    return (
        <Combobox
            items={dynamicItems}
            filter={() => true}
            multiple
            autoHighlight
            value={value || []}
            onValueChange={onChange}
            onInputValueChange={setInputValue}
            disabled={disabled}
        >
            <ComboboxChips ref={anchor}>
                <ComboboxValue>
                    {value.map((item) => (
                        <ComboboxChip key={item} className={"border border-input"}>
                            {item}
                        </ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput
                    id={id}
                    placeholder={t('tickets.form.intervene.fields.tags.placeholder')}
                />
            </ComboboxChips>

            <ComboboxContent anchor={anchor} >

                {(isLoading || isSyncing || dynamicItems.length === 0) && (

                    <div className={"flex w-full flex-col items-center justify-center py-2 text-center text-sm text-muted-foreground border-b border-transparent"}>
                        {isLoading ? (
                            <Loader2 className="animate-spin text-muted-foreground h-5 w-5" />
                        ) : isSyncing ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="animate-pulse">{t('tickets.form.intervene.fields.tags.searching')}</span>
                            </div>
                        ) : (
                            <span>{t('tickets.form.intervene.fields.tags.not_found.label')}</span>
                        )}
                    </div>
                )}
                <ComboboxList className={cn(
                    isSyncing ? "opacity-50 transition-opacity pointer-events-none" : "transition-opacity",
                    "scrollbar-none"
                )}>
                    {dynamicItems.map((item) => {

                        if (item === '__LOAD_MORE__') {
                            return (
                                <ComboboxItem
                                    key="load-more"
                                    value="__LOAD_MORE__"
                                    disabled
                                >

                                    <div
                                        ref={lastElementRef}
                                        className="flex items-center justify-center gap-2 text-muted-foreground"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">{t('tickets.form.intervene.fields.tags.loading_more')}</span>
                                            </>
                                        ) : (
                                            <span />
                                        )}
                                    </div>
                                </ComboboxItem>
                            );
                        }

                        const isNewTag = !tagNames.includes(item) && !value?.includes(item);

                        return (
                            <ComboboxItem
                                key={item}
                                value={item}
                                disabled={isSyncing}
                            >
                                {isNewTag ? (
                                    <>
                                        <div className="size-5 rounded bg-primary/20 hover:bg-primary/30 flex items-center justify-center">
                                            <Plus />
                                        </div>
                                        <span>
                                            {t('tickets.form.intervene.fields.tags.create.label')} <strong>"{item}"</strong>
                                        </span>
                                    </>
                                ) : (
                                    item
                                )}
                            </ComboboxItem>
                        );
                    })}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
