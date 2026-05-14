
import { useEffect, useMemo } from "react";
import { InfiniteScrollSelect } from "../components/infinite-scroll-select";
interface CatalogOption {
    id: string;
    name: string;
    [key: string]: string | number | boolean | null | Record<string, unknown>; // Allow for dynamic properties like first_name, brand, etc.
}
interface CatalogHook {
    options: CatalogOption[];
    isLoading: boolean;
    setSearch: (term: string) => void;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isCreating: boolean;
    onCreate: (data: string | Record<string, unknown>) => Promise<CatalogOption>;
    setSelectedId: (id: string | null) => void;
    isFetchingNextPage: boolean;
    singleData?: CatalogOption;
}

interface CatalogSelectorProps {
    hook: CatalogHook;
    value: { id: string; name: string } | null;
    onChange: (val: { id: string; name: string } | null) => void;
    placeholder?: string;
    allowCreate?: boolean;
    disabled?: boolean;
}

export const CatalogSelector = ({
    hook,
    value,
    onChange,
    placeholder,
    allowCreate = true,
    disabled = false,
}: CatalogSelectorProps) => {
    const {
        options,           // Ya viene combinada desde el factory hook
        isLoading,
        setSearch,
        fetchNextPage,
        hasNextPage,
        isCreating,
        onCreate,
        setSelectedId,     // Para hidratar en edición
        isFetchingNextPage
    } = hook;

    // 1. Hidratación: Si el formulario tiene un ID pero no el objeto, 
    // le pedimos al hook que lo busque en el backend.
    useEffect(() => {
        if (value?.id) {
            setSelectedId(value.id);
        } else {
            setSelectedId(null);
        }
    }, [value?.id, setSelectedId]);

    const formattedOptions = useMemo(() => {
        return options.map((opt: CatalogOption) => {
            // 1. Caso Responsable (Basado en tu mapToDto del back)
            if (opt.first_name || opt.last_name) {
                return {
                    id: opt.id,
                    name: `${opt.name || ''} ${opt.first_name || ''} ${opt.last_name || ''}`.trim()
                };
            }

            // 2. Caso Modelo (Basado en tu relación id_model e id_brand)
            if (opt.name && opt.id_brand) {
                return {
                    id: opt.id,
                    name: String(opt.name)
                };
            }

            // 3. Caso Procesador (Basado en brand y model) cuando este en vista del scroll
            if (opt.brand && opt.model) {
                return {
                    id: opt.id,
                    name: `${opt.brand} ${opt.model} ${opt.description} `.trim()
                };
            }

            // 4. Caso Genérico (Departamento, Tipo de Equipo)
            return {
                id: opt.id,
                name: opt.name || "Sin nombre"
            };
        });
    }, [options]);
    // 3. Creación de nuevos elementos
    const handleCreate = async (name: string) => {
        try {
            const newItem = await onCreate(name);
            if (newItem) {
                // Notificamos al formulario con el objeto recién creado
                onChange({
                    id: newItem.id,
                    name: String(newItem.first_name || newItem.last_name || newItem.model || name)
                });
            }
        } catch (error) {
            console.error("Error al crear elemento:", error);
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
