/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { InfiniteScrollSelectconsumables } from "../components/infinite-scroll-selectconsu";

interface UISelectOption {
    id: string;
    name: string;
}

interface CatalogHook {
    options: any[];
    isLoading: boolean;
    setSearch: (term: string) => void;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isCreating: boolean;
    onCreate: (data: any) => Promise<any>;
    setSelectedId: (id: string | null) => void;
    isFetchingNextPage: boolean;
    singleData?: any | null;
}

interface CatalogSelectorProps {
    hook: CatalogHook;
    value: UISelectOption | null;
    onChange: (val: UISelectOption | null) => void;
    placeholder?: string;
    allowCreate?: boolean;
    disabled?: boolean;
    onCreate?: (name: string) => Promise<void> | void;
}

export const CatalogSelector = ({
    hook,
    value,
    onChange,
    placeholder,
    allowCreate = true,
    disabled = false,
    onCreate: customOnCreate
}: CatalogSelectorProps) => {
    const {
        options,
        isLoading,
        setSearch,
        fetchNextPage,
        hasNextPage,
        isCreating,
        onCreate: defaultOnCreate,
        setSelectedId,
        isFetchingNextPage,
        singleData
    } = hook;

    useEffect(() => {
        if (value?.id) {
            setSelectedId(value.id);
        } else {
            setSelectedId(null);
        }
    }, [value?.id, setSelectedId]);
    const formattedOptions = useMemo<UISelectOption[]>(() => {
        const safeOptions = Array.isArray(options) ? options : [];

        const listOptions = safeOptions.map((opt: any) => {
            if (!opt) return { id: "", name: "Elemento inválido" };
            if (opt.folio) {
                const ticketDesc = opt.description ? ` - ${opt.description}` : '';
                return {
                    id: String(opt.id),
                    name: `Ticket: ${opt.folio}${ticketDesc}`.replace(/\s+/g, ' ').trim()
                };
            }

            if (opt.brand || opt.model) {
                return {
                    id: String(opt.id),
                    name: `${opt.brand || ''} ${opt.model || ''} ${opt.description || ''}`.trim()
                };
            }

            if (opt.name) {
                return {
                    id: String(opt.id),
                    name: String(opt.name).trim()
                };
            }

            return {
                id: String(opt.id || ''),
                name: opt.id ? `ID: ${opt.id}` : "Sin nombre o folio asignado"
            };
        });

        if (singleData && !listOptions.some(opt => opt.id === String(singleData.id))) {
            let singleName;

            if (singleData.folio) {
                const singleDesc = singleData.description ? ` - ${singleData.description}` : '';
                singleName = `Ticket: ${singleData.folio}${singleDesc}`;
            } else if (singleData.brand || singleData.model) {
                singleName = `${singleData.brand || ''} ${singleData.model || ''} ${singleData.description || ''}`;
            } else {
                singleName = singleData.name || `ID: ${singleData.id}`;
            }

            listOptions.unshift({
                id: String(singleData.id),
                name: singleName.trim()
            });
        }

        return listOptions;
    }, [options, singleData]);
    const handleCreate = async (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        if (customOnCreate) {
            await customOnCreate(trimmedName);
            return;
        }

        // Fallback por si se usa directo sin handler customizado en el componente padre
        try {
            const newItem = await defaultOnCreate({ name: trimmedName });
            if (newItem) {
                const displayName = (newItem.brand && newItem.model)
                    ? `${newItem.brand} ${newItem.model} ${newItem.description || ""}`.trim()
                    : String(newItem.name || newItem.first_name || trimmedName);

                onChange({
                    id: newItem.id,
                    name: displayName
                });
            }
        } catch (error) {
            console.error("Error Catalogs:", error);
        }
    };

    return (
        <InfiniteScrollSelectconsumables
            options={formattedOptions}
            value={value}
            onChange={onChange}
            onSearch={setSearch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading || isCreating}
            isFetchingNextPage={isFetchingNextPage}
            placeholder={placeholder}
            allowCreate={allowCreate && !disabled}
            onCreate={handleCreate}
            disabled={disabled}
        />
    );
};