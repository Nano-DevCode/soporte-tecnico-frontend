/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { InfiniteScrollSelect } from "../components/infinite-scroll-select";

interface ExtendedCatalogProperties {
    id: string;
    name: string;
    first_name?: string;
    last_name?: string;
    area?: string;
    id_brand?: string;
    brand?: string;
    model?: string;
    description?: string;
}

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
    onCreate: (data: string) => Promise<any>;
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
        isFetchingNextPage
    } = hook;

    // Sincronización para edición e hidratación de datos
    useEffect(() => {
        if (value?.id) {
            setSelectedId(value.id);
        } else {
            setSelectedId(null);
        }
    }, [value?.id, setSelectedId]);

    // Mapeador inteligente de nombres según las llaves del objeto
    const formattedOptions = useMemo<UISelectOption[]>(() => {
        return options.map((opt: ExtendedCatalogProperties) => {
            if (opt.first_name || opt.last_name) {
                return {
                    id: opt.id,
                    name: `${opt.name || ''} ${opt.first_name || ''} ${opt.last_name || ''} - Área: ${opt.area || ''}`.replace(/\s+/g, ' ').trim()
                };
            }
            if (opt && opt.id && opt.name) {
                return {
                    id: opt.id,
                    name: String(opt.name)
                };
            }
            if (opt.brand && opt.model) {
                return {
                    id: opt.id,
                    name: `${opt.brand} ${opt.model} ${opt.description || ''}`.replace(/\s+/g, ' ').trim()
                };
            }
            return {
                id: opt.id,
                name: opt.name || "Sin nombre asignado"
            };
        });
    }, [options]);

    const handleCreate = async (name: string) => {
        if (customOnCreate) {
            await customOnCreate(name);
            return;
        }

        try {
            const newItem = await defaultOnCreate(name);
            if (newItem) {
                const displayName = (newItem.brand && newItem.model)
                    ? `${newItem.brand} ${newItem.model} ${newItem.description || ""}`.trim()
                    : String(newItem.name || newItem.first_name || name);

                onChange({
                    id: newItem.id,
                    name: displayName
                });
            }
        } catch (error) {
            console.error("Error controlado en CatalogSelector:", error);
        }
    };

    return (
        <InfiniteScrollSelect
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
