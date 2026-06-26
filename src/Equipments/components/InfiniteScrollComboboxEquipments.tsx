import { useDebounce } from "@/components/hooks/useDebounce";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Building2, Hash, Loader2, Tag, User } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteGetEquipments } from "../hooks/useInfiniteGetEquipments";
import type { EquipmentItem } from "../interfaces/euipment-item.interface";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

interface Props {
    value: EquipmentItem[] | undefined;
    onChange: (value: EquipmentItem[]) => void;
    disabled?: boolean;
    id?: string;
}
export const InfiniteScrollComboboxEquipments = ({ value = [], onChange, disabled, id }: Props) => {

    const { t } = useTranslation();
    const anchor = useComboboxAnchor();
    const [inputValue, setInputValue] = useState("");

    const debouncedSearch = useDebounce(inputValue, 300);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteGetEquipments({
        search: debouncedSearch
    });

    const isTyping = inputValue !== debouncedSearch && inputValue.trim().length > 0;
    const isSearchFetching = isFetching && !isFetchingNextPage;
    const isSyncing = isTyping || isSearchFetching;

    const equipments = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) || [];
    }, [data]);


    const dynamicItems = useMemo(() => {
        const items: (EquipmentItem | '__LOAD_MORE__')[] = [...equipments] as EquipmentItem[];
        if (hasNextPage) { items.push('__LOAD_MORE__') }

        return items;
    }, [equipments, hasNextPage]);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    return (
        <>
            <Combobox
                items={dynamicItems}
                filter={() => true}
                multiple
                autoHighlight
                value={value}
                isItemEqualToValue={(itemValue, value) => {
                    if (!itemValue || !itemValue.id) {
                        return false;
                    }
                    return value.id === itemValue.id;
                }}
                onValueChange={onChange}
                onInputValueChange={setInputValue}
                disabled={disabled}
            >
                <ComboboxChips ref={anchor} className={"flex-col items-start"}>
                    <ComboboxValue>
                        {(equipmentValues: EquipmentItem[]) => (
                            <React.Fragment>
                                <ComboboxChipsInput className={"w-full"} id={id} placeholder={t('tickets.form.intervene.fields.equipment_ids.placeholder')} />

                                {equipmentValues.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                            {equipmentValues.map((equipValue) => (
                                                <ComboboxChip
                                                    className="border bg-card text-card-foreground shadow-sm rounded-lg p-3 h-auto w-full"
                                                    key={equipValue.id}>
                                                    <div className="w-full">
                                                        <div className="flex items-center gap-2 mb-1.5 w-full">
                                                            <Hash className="w-4 h-4 text-primary shrink-0" />
                                                            <span className="font-semibold text-sm truncate">
                                                                {equipValue.folio}
                                                            </span>
                                                            <Badge variant={"secondary"} className="text-[10px] font-medium">
                                                                {equipValue.typeEquipmentComputer || equipValue.type}
                                                            </Badge>
                                                        </div>
                                                        <Separator />
                                                        <div className="ml-5 flex flex-col gap-1 w-full text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5 truncate">
                                                                <User className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{equipValue.responsableName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 truncate">
                                                                <Building2 className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{equipValue.departamento}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 truncate">
                                                                <Tag className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{equipValue.model}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ComboboxChip>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </React.Fragment>
                        )}
                    </ComboboxValue>
                </ComboboxChips>

                <ComboboxContent side="top" anchor={anchor} >

                    {(isLoading || isSyncing || dynamicItems.length === 0) && (

                        <div className={"flex w-full flex-col items-center justify-center py-2 text-center text-sm text-muted-foreground border-b border-transparent"}>
                            {isLoading ? (
                                <Loader2 className="animate-spin text-muted-foreground h-5 w-5" />
                            ) : isSyncing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span className="animate-pulse">{t('tickets.form.intervene.fields.equipment_ids.searching')}</span>
                                </div>
                            ) : (
                                <span>{t('tickets.form.intervene.fields.equipment_ids.not_found.label')}</span>
                            )}
                        </div>
                    )}
                    <ComboboxList className={cn(
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
                                                    <span className="text-xs text-muted-foreground">
                                                        {t('tickets.form.intervene.fields.equipment_ids.loading_more')}
                                                    </span>
                                                </>
                                            ) : (
                                                <span />
                                            )}
                                        </div>
                                    </ComboboxItem>
                                );
                            }

                            return (
                                <ComboboxItem
                                    key={item.id}
                                    value={item}
                                    disabled={isSyncing}
                                >
                                    <Item className="px-1 py-1">
                                        <ItemContent>
                                            <ItemTitle className="flex-wrap">
                                                <span className="font-medium text-sm flex items-center gap-2">
                                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                                    {item.folio}
                                                </span>
                                                <Badge variant={"secondary"} className="text-[10px] font-medium">
                                                    {item.typeEquipmentComputer || item.type}
                                                </Badge>
                                            </ItemTitle>
                                            <ItemDescription className="flex flex-wrap items-center text-xs gap-3 w-full">
                                                <span className="flex items-center gap-1 truncate">
                                                    <User className="w-3 h-3" /> {item.responsableName}
                                                </span>
                                                <span className="flex items-center gap-1 truncate">
                                                    <Building2 className="w-3 h-3" /> {item.departamento}
                                                </span>
                                            </ItemDescription>
                                        </ItemContent>
                                    </Item>
                                </ComboboxItem>
                            );
                        })}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </>
    )
}
